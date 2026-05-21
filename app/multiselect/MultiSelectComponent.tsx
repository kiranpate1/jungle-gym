"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function MultiSelectComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const nav = root.querySelector("nav") as HTMLElement | null;
    const toggle = root.querySelector(".toggle") as HTMLElement | null;
    const content = root.querySelector(".content") as HTMLElement | null;
    const tray = root.querySelector(".tray") as HTMLElement | null;
    const activeTagsContainer = root.querySelector(
      ".active-tags",
    ) as HTMLElement | null;
    const title = root.querySelector("#title") as HTMLElement | null;

    if (
      !nav ||
      !toggle ||
      !content ||
      !tray ||
      !activeTagsContainer ||
      !title
    ) {
      return;
    }

    const navEl = nav;
    const toggleEl = toggle;
    const contentEl = content;
    const trayEl = tray;
    const activeTagsEl = activeTagsContainer;
    const titleEl = title;
    const trayHeight = trayEl.getBoundingClientRect().height;

    const trayItems = root.querySelectorAll(
      ".tray-item",
    ) as NodeListOf<HTMLElement>;
    const itemState = new Map<HTMLElement, boolean>();
    const trayItemCleanup = new Map<HTMLElement, () => void>();
    const timeouts: number[] = [];

    trayEl.style.transform = "scaleY(1.5)";

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const resetToggleState = () => {
      navEl.classList.remove("active", "lighter");
      navEl.style.background = "#1D2026";
      navEl.style.minWidth = "220px";
      contentEl.style.height = "0px";
      toggleEl.classList.remove("stay-open", "stay-closed");
      activeTagsEl.innerHTML = "";
      trayItems.forEach((item) => {
        item.style.opacity = "1";
        item.style.transition = "";
        itemState.set(item, false);
      });
    };

    function createInlineTag(i: number) {
      const activeTrayItem = trayItems[i];
      const duplicateTrayItem = activeTrayItem.cloneNode(true) as HTMLElement;
      const activeRect = activeTrayItem.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      duplicateTrayItem.setAttribute("data-index", i.toString());
      duplicateTrayItem.style.position = "absolute";
      duplicateTrayItem.style.zIndex = "99";
      duplicateTrayItem.style.top = `${activeRect.top - navRect.top}px`;
      duplicateTrayItem.style.left = `${activeRect.left - navRect.left}px`;
      activeTagsEl.appendChild(duplicateTrayItem);

      duplicateTrayItem.setAttribute(
        "data-widthhug",
        `${duplicateTrayItem.offsetWidth}px`,
      );
      duplicateTrayItem.setAttribute("data-widthfull", `${activeRect.width}px`);
      duplicateTrayItem.style.width = `${activeRect.width}px`;
      duplicateTrayItem.setAttribute(
        "data-top",
        `${duplicateTrayItem.offsetTop}px`,
      );
      duplicateTrayItem.setAttribute(
        "data-left",
        `${duplicateTrayItem.offsetLeft}px`,
      );
    }

    function animateTagsUp() {
      const activeTags = activeTagsEl.querySelectorAll(
        ".tray-item",
      ) as NodeListOf<HTMLElement>;
      let leftOffset = titleEl.offsetWidth + 32;

      activeTags.forEach((tag, i) => {
        tag.classList.remove("active");
        tag.style.width = tag.dataset.widthhug!;
        tag.style.top = "6px";
        tag.style.left = `${leftOffset}px`;
        leftOffset += parseFloat(tag.dataset.widthhug!) + 4;

        if (i === activeTags.length - 1) {
          navEl.style.minWidth = `${leftOffset + 38}px`;
        }
      });
    }

    function animateTagsDown() {
      const activeTags = activeTagsEl.querySelectorAll(
        ".tray-item",
      ) as NodeListOf<HTMLElement>;
      activeTags.forEach((tag) => {
        const originalTop = tag.dataset.top;
        const originalLeft = tag.dataset.left;
        tag.style.width = tag.dataset.widthfull!;
        tag.style.top = originalTop!;
        tag.style.left = originalLeft!;
      });
      navEl.style.minWidth = "220px";
    }

    const handleToggleClick = () => {
      const isOpen = navEl.classList.toggle("active");
      navEl.classList.add("lighter");

      if (isOpen) {
        contentEl.style.height = `${trayHeight}px`;
        animateTagsDown();
        timeouts.push(
          window.setTimeout(() => {
            navEl.classList.remove("lighter");
          }, 200),
        );
      } else {
        contentEl.style.height = "0px";
        animateTagsUp();
        timeouts.push(
          window.setTimeout(() => {
            navEl.classList.remove("lighter");
          }, 400),
        );
      }
    };

    const handleToggleMouseEnter = () => {
      navEl.style.background = "#2D323D";
      if (!navEl.classList.contains("active")) {
        toggleEl.classList.add("stay-open");
      }
      if (navEl.classList.contains("active")) {
        toggleEl.classList.add("stay-closed");
      }
    };

    const handleToggleMouseLeave = () => {
      navEl.style.background = "#1D2026";
      if (navEl.classList.contains("active")) {
        toggleEl.classList.remove("stay-open");
      }
      if (!navEl.classList.contains("active")) {
        toggleEl.classList.remove("stay-closed");
      }
    };

    const handleTrayItemClick = (item: HTMLElement, i: number) => {
      const isTagActive = itemState.get(item) ?? false;

      if (!isTagActive) {
        createInlineTag(i);
        item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        item.style.opacity = "0";
        itemState.set(item, true);
      } else {
        const activeTags = activeTagsEl.querySelectorAll(
          ".tray-item",
        ) as NodeListOf<HTMLElement>;
        activeTags.forEach((tag) => {
          if (tag.dataset.index === i.toString()) {
            tag.remove();
          }
        });
        item.style.transition = "opacity 0s, transform 0.6s ease";
        item.style.opacity = "1";
        itemState.set(item, false);
      }
    };

    trayItems.forEach((item, i) => {
      const onClick = () => handleTrayItemClick(item, i);
      item.addEventListener("click", onClick);
      trayItemCleanup.set(item, () => {
        item.removeEventListener("click", onClick);
        item.style.opacity = "1";
        item.style.transition = "";
        itemState.set(item, false);
      });
    });

    navEl.addEventListener("mouseenter", handleToggleMouseEnter);
    navEl.addEventListener("mouseleave", handleToggleMouseLeave);
    toggleEl.addEventListener("click", handleToggleClick);

    resetToggleState();

    return () => {
      clearScheduled();
      toggleEl.removeEventListener("click", handleToggleClick);
      navEl.removeEventListener("mouseenter", handleToggleMouseEnter);
      navEl.removeEventListener("mouseleave", handleToggleMouseLeave);
      trayItemCleanup.forEach((cleanup) => cleanup());
      resetToggleState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="multiselect-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <main>
        <nav>
          <div className="toggle">
            <div className="toggle-content">
              <p className="bold" id="title">
                Filter by
              </p>
              <div className="type">
                <div className="active-tags"></div>
                <div className="icon">
                  <div className="icon-top"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="tray">
              <div className="tray-item">
                <small>Pop</small>
              </div>
              <div className="tray-item">
                <small>Rock</small>
              </div>
              <div className="tray-item">
                <small>Hip-Hop</small>
              </div>
              <div className="tray-item">
                <small>R&B</small>
              </div>
              <div className="tray-item">
                <small>EDM</small>
              </div>
              <div className="tray-item">
                <small>Country</small>
              </div>
              <div className="tray-item">
                <small>Jazz</small>
              </div>
              <div className="tray-item">
                <small>Reggae</small>
              </div>
              <div className="tray-item">
                <small>Latin</small>
              </div>
            </div>
            <div className="gradient-blur">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </nav>
        <svg
          className="profile"
          viewBox="0 0 41 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1197_307)">
            <rect
              x="0.5"
              y="0.5"
              width="40"
              height="40"
              rx="20"
              fill="#070A0E"
            />
            <path
              d="M5.71981 40.5096H35.7198C35.9503 40.5097 36.1738 40.4301 36.3524 40.2843C36.531 40.1385 36.6537 39.9355 36.6998 39.7096C36.779 39.4854 36.774 33.2401 36.6857 33.0193C36.5974 32.7985 36.4318 32.6174 36.2198 32.5096L26.2198 27.9096C26.1304 27.8706 26.0543 27.8062 26.001 27.7245C25.9477 27.6428 25.9195 27.5472 25.9198 27.4496V25.3896C25.9182 25.3215 25.9316 25.2539 25.9593 25.1916C25.987 25.1294 26.0281 25.074 26.0798 25.0296L26.2798 24.8096C27.1083 23.531 27.5334 22.0328 27.4998 20.5096C27.5014 20.4351 27.5202 20.362 27.5549 20.296C27.5897 20.23 27.6393 20.1731 27.6998 20.1296C28.1088 19.7894 28.4349 19.3603 28.6532 18.8752C28.8716 18.39 28.9764 17.8614 28.9598 17.3296C28.9758 16.9103 28.8999 16.4926 28.7375 16.1057C28.5752 15.7187 28.3302 15.372 28.0198 15.0896C27.9407 15.0182 27.8836 14.9257 27.8553 14.8229C27.827 14.7202 27.8285 14.6115 27.8598 14.5096C28.1369 13.7857 28.2466 13.0084 28.1808 12.2361C28.115 11.4637 27.8754 10.7163 27.4798 10.0496C26.7858 9.20466 25.9029 8.53458 24.9024 8.09339C23.9019 7.6522 22.8118 7.45224 21.7198 7.50962C19.8598 7.50962 15.7198 7.50962 14.8598 10.3096C14.8296 10.3867 14.7839 10.4567 14.7254 10.5152C14.6668 10.5737 14.5969 10.6195 14.5198 10.6496C14.0695 10.7651 13.6735 11.0338 13.3998 11.4096C13.1606 11.9055 13.0364 12.449 13.0364 12.9996C13.0364 13.5502 13.1606 14.0937 13.3998 14.5896C13.4341 14.68 13.439 14.7789 13.4139 14.8722C13.3887 14.9656 13.3348 15.0486 13.2598 15.1096C12.7122 15.6888 12.3736 16.4341 12.2975 17.2275C12.2214 18.0209 12.4123 18.817 12.8398 19.4896C13.0283 19.7776 13.2818 20.0174 13.5798 20.1896C13.6499 20.233 13.7096 20.2914 13.7545 20.3605C13.7995 20.4297 13.8286 20.5079 13.8398 20.5896C13.8742 22.1741 14.4776 23.6933 15.5398 24.8696C15.6263 24.9621 15.6761 25.083 15.6798 25.2096V27.5296C15.6801 27.6272 15.6519 27.7228 15.5986 27.8045C15.5453 27.8862 15.4692 27.9506 15.3798 27.9896L5.31981 32.5096C5.18849 32.5359 5.06362 32.5878 4.95235 32.6623C4.84107 32.7368 4.74557 32.8325 4.67128 32.9439C4.52125 33.169 4.46676 39.4444 4.51981 39.7096C4.57285 39.9748 4.72908 40.2081 4.95412 40.3581C5.17917 40.5082 5.45459 40.5627 5.71981 40.5096Z"
              fill="#404655"
            />
          </g>
          <rect
            x="0.5"
            y="0.5"
            width="40"
            height="40"
            rx="20"
            stroke="#404655"
          />
          <defs>
            <clipPath id="clip0_1197_307">
              <rect
                x="0.5"
                y="0.5"
                width="40"
                height="40"
                rx="20"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>
      </main>
    </div>
  );
}
