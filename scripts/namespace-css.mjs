#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value =
      argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
    args[key] = value;
  }

  return args;
}

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/namespace-css.mjs --input <file> --root <.root-class> [--output <file>]",
      "",
      "Examples:",
      "  node scripts/namespace-css.mjs --input app/flights/style.css --root .flights-root",
      "  node scripts/namespace-css.mjs --input app/chat/style.css --root .chat-root --output app/chat/style.scoped.css",
    ].join("\n"),
  );
}

function isKeyframesRule(rule) {
  const parent = rule.parent;
  return parent?.type === "atrule" && /keyframes$/i.test(parent.name ?? "");
}

function startsWithRootTag(selector) {
  return /^(:root\b|html\b|body\b)/.test(selector.trim());
}

function replaceRootTags(selector, rootClass) {
  const trimmed = selector.trim();
  if (trimmed === `body:has(${rootClass})`) {
    return rootClass;
  }

  if (trimmed.startsWith(":root")) {
    return trimmed.replace(/^:root\b/, rootClass);
  }

  if (/^(html|body)\b/.test(trimmed)) {
    return trimmed.replace(/^(html|body)\b/, rootClass);
  }

  return selector;
}

const dedupeSelectorsPlugin = {
  postcssPlugin: "dedupe-selectors",
  Rule(rule) {
    if (!rule.selectors || rule.selectors.length <= 1) {
      return;
    }

    const seen = new Set();
    rule.selectors = rule.selectors.filter((selector) => {
      const normalized = selector.trim();
      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input;
  const outputPath = args.output || inputPath;
  const rootClass = args.root;

  if (
    !inputPath ||
    !rootClass ||
    typeof inputPath !== "string" ||
    typeof rootClass !== "string"
  ) {
    usage();
    process.exit(1);
  }

  if (!rootClass.startsWith(".")) {
    console.error("--root must be a class selector, for example .flights-root");
    process.exit(1);
  }

  const absoluteInput = path.resolve(process.cwd(), inputPath);
  const absoluteOutput = path.resolve(process.cwd(), outputPath);
  const css = await fs.readFile(absoluteInput, "utf8");

  const result = await postcss([
    prefixSelector({
      prefix: rootClass,
      transform(prefix, selector, prefixedSelector, filePath, rule) {
        const cleanSelector = selector.trim();

        if (!cleanSelector) return selector;
        if (isKeyframesRule(rule)) return selector;
        if (cleanSelector.startsWith("@")) return selector;

        if (startsWithRootTag(cleanSelector)) {
          return replaceRootTags(cleanSelector, rootClass);
        }

        if (cleanSelector.includes(prefix)) return selector;

        return prefixedSelector;
      },
    }),
    dedupeSelectorsPlugin,
  ]).process(css, { from: absoluteInput, to: absoluteOutput });

  await fs.writeFile(absoluteOutput, result.css, "utf8");
  console.log(
    `Namespaced CSS written to ${path.relative(process.cwd(), absoluteOutput)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
