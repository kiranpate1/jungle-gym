"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function LightDarkScrollComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const updateWindowWidthHeight = () => {
      root.style.setProperty("--window-width", `${root.clientWidth}px`);
      root.style.setProperty("--window-height", `${root.clientHeight}px`);
    };

    const resizeObserver = new ResizeObserver(updateWindowWidthHeight);
    resizeObserver.observe(root);
    window.addEventListener("resize", updateWindowWidthHeight);
    updateWindowWidthHeight();

    const stars = root.querySelector(".stars") as HTMLImageElement | null;
    const section1 = root.querySelector(".section-1") as HTMLDivElement | null;
    const section2 = root.querySelector(".section-2") as HTMLDivElement | null;
    const toggleTexts = root.querySelectorAll(
      ".toggle-text h1",
    ) as NodeListOf<HTMLHeadingElement>;
    const switchEl = root.querySelector(".switch") as HTMLDivElement | null;
    const knob = root.querySelector(".knob") as HTMLDivElement | null;
    const s1 = root.querySelector("#s1-target") as HTMLDivElement | null;
    const s2 = root.querySelector("#s2-target") as HTMLDivElement | null;

    if (!stars || !section1 || !section2 || !switchEl || !knob || !s1 || !s2) {
      return;
    }

    let isSwitchOn = false;
    let p1 = 0;
    let p2 = 0;

    const resetState = () => {
      stars.style.opacity = "";
      toggleTexts.forEach((item) => {
        item.style.transform = "";
      });
      switchEl.style.background = "";
      knob.style.transform = "";
      root.style.removeProperty("--h1-width");
    };

    const easeInOutQuint = (t: number) => {
      let value = t / 0.5;
      if (value < 1) return 0.5 * Math.pow(value, 5);
      value -= 2;
      return 0.5 * (Math.pow(value, 5) + 2);
    };

    const applySwitchState = (on: boolean) => {
      isSwitchOn = on;
      switchEl.style.background = on ? "#32D74B" : "#78788032";
      knob.style.transform = on ? "translateX(22px)" : "translateX(2px)";
    };

    const applyIntermediateState = (scroll: number) => {
      const rawProgress = (scroll - p1) / Math.max(p2 - p1, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 1);
      const ease = easeInOutQuint(progress);

      stars.style.opacity = `${ease}`;
      toggleTexts.forEach((item) => {
        item.style.transform = `translateY(${ease * -100}%)`;
      });
      const widthPx = root.clientWidth * (0.316 - ease * 0.119);
      root.style.setProperty("--h1-width", `${widthPx}px`);
      applySwitchState(ease > 0.5);
    };

    const recalculateThresholds = () => {
      p1 = (root.scrollHeight - root.clientHeight) / 2;
      p2 = section2.offsetTop;
    };

    const handleScroll = () => {
      const scroll = root.scrollTop;

      if (scroll < p1) {
        stars.style.opacity = "0";
        toggleTexts.forEach((item) => {
          item.style.transform = "translateY(0%)";
        });
        root.style.setProperty("--h1-width", `${root.clientWidth * 0.316}px`);
        applySwitchState(false);
        return;
      }

      if (scroll > p2) {
        stars.style.opacity = "1";
        toggleTexts.forEach((item) => {
          item.style.transform = "translateY(-100%)";
        });
        root.style.setProperty("--h1-width", `${root.clientWidth * 0.197}px`);
        applySwitchState(true);
        return;
      }

      applyIntermediateState(scroll);
    };

    const handleResize = () => {
      recalculateThresholds();
      handleScroll();
    };

    const handleSwitchClick = () => {
      const getRelativeTop = (el: HTMLElement) => {
        const rootRect = root.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const top = root.scrollTop + (elRect.top - rootRect.top);
        const maxTop = Math.max(0, root.scrollHeight - root.clientHeight);
        return Math.min(Math.max(top, 0), maxTop);
      };

      if (isSwitchOn) {
        isSwitchOn = false;
        root.scrollTo({ top: getRelativeTop(section1), behavior: "smooth" });
        return;
      }

      isSwitchOn = true;
      root.scrollTo({ top: getRelativeTop(section2), behavior: "smooth" });
    };

    recalculateThresholds();
    handleScroll();

    root.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    switchEl.addEventListener("click", handleSwitchClick);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWindowWidthHeight);
      root.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      switchEl.removeEventListener("click", handleSwitchClick);
      resetState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="lightdark-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div className="top">
        <img
          src="https://cdn.prod.website-files.com/66c503d081b2f012369fc5d2/66d74ff10e7c1fe8e1acd70c_Front.png"
          alt="phone"
          className="phone"
        />
        <div className="switch">
          <div className="knob"></div>
        </div>
      </div>
      <div className="content">
        <div className="background">
          <div className="notch">
            <svg
              viewBox="0 0 60 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 -0.000976562H60V39.999C34 39.999 31.5 26.998 30 19.999C28.5 13 26 -0.000976562 0 -0.000976562Z"
                fill="black"
              />
            </svg>
            <div className="links">
              <a>Try</a>
              <a>Learn</a>
              <a>Buy</a>
            </div>
            <svg
              viewBox="0 0 60 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M60 0H0V40C26 40 28.5 26.999 30 20C31.5 13.001 34 0 60 0Z"
                fill="black"
              />
            </svg>
          </div>
          <img
            src="https://cdn.prod.website-files.com/66c503d081b2f012369fc5d2/66d926023c4be67a0322c30d_stars.svg"
            alt="stars"
            className="stars"
          />
        </div>
        <div className="heading">
          <h1>Good </h1>
          <div className="toggle-text">
            <h1>morning.</h1>
            <h1>night.</h1>
          </div>
        </div>
        <img
          src="https://cdn.prod.website-files.com/66c503d081b2f012369fc5d2/66d9e01e4fa5e2f63aeda7fb_screen.png"
          alt=""
          className="screen"
        />
      </div>
      <div className="section-1">
        <div id="s1-target"></div>
      </div>
      <div className="transition">
        <div className="blur-top">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="blur-bot">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="section-2">
        <div id="s2-target"></div>
      </div>
    </div>
  );
}
