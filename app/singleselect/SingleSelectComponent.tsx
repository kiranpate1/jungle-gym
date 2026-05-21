"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function SingleSelectComponent() {
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

    if (!nav || !toggle || !content || !tray) {
      return;
    }

    const timeouts: number[] = [];
    const trayHeight = tray.getBoundingClientRect().height;
    tray.style.transform = "scaleY(2)";

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const resetToggleState = () => {
      nav.classList.remove("active", "lighter");
      nav.style.background = "#1D2026";
      content.style.height = "0px";
      toggle.classList.remove("stay-open", "stay-closed");
    };

    const handleToggleClick = () => {
      const isOpen = nav.classList.toggle("active");
      nav.classList.add("lighter");

      if (isOpen) {
        content.style.height = `${170}px`;
        timeouts.push(
          window.setTimeout(() => {
            nav.classList.remove("lighter");
          }, 200),
        );
      } else {
        content.style.height = "0px";
        timeouts.push(
          window.setTimeout(() => {
            nav.classList.remove("lighter");
          }, 400),
        );
      }
    };

    const handleToggleMouseEnter = () => {
      nav.style.background = "#2D323D";
      if (!nav.classList.contains("active")) {
        toggle.classList.add("stay-open");
      }
      if (nav.classList.contains("active")) {
        toggle.classList.add("stay-closed");
      }
    };

    const handleToggleMouseLeave = () => {
      nav.style.background = "#1D2026";
      if (nav.classList.contains("active")) {
        toggle.classList.remove("stay-open");
      }
      if (!nav.classList.contains("active")) {
        toggle.classList.remove("stay-closed");
      }
    };

    toggle.addEventListener("click", handleToggleClick);
    toggle.addEventListener("mouseenter", handleToggleMouseEnter);
    toggle.addEventListener("mouseleave", handleToggleMouseLeave);

    resetToggleState();

    return () => {
      clearScheduled();
      toggle.removeEventListener("click", handleToggleClick);
      toggle.removeEventListener("mouseenter", handleToggleMouseEnter);
      toggle.removeEventListener("mouseleave", handleToggleMouseLeave);
      resetToggleState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="singleselect-root"
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
              <p className="bold">View</p>
              <svg
                width="5"
                height="8"
                viewBox="0 0 5 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.71 6.87957L4.3 4.28957C4.3927 4.19706 4.46625 4.08717 4.51643 3.9662C4.56661 3.84522 4.59244 3.71554 4.59244 3.58457C4.59244 3.4536 4.56661 3.32392 4.51643 3.20295C4.46625 3.08197 4.3927 2.97208 4.3 2.87957L1.71 0.289571C1.08 -0.330429 0 0.109571 0 0.999571V6.16957C0 7.06957 1.08 7.50957 1.71 6.87957Z"
                  opacity="0.4"
                  fill="white"
                />
              </svg>

              <div className="type">
                <p className="light" id="option">
                  Music
                </p>
                <div className="icon">
                  <div className="icon-top"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="tray">
              <div className="tray-item">
                <p className="bold">Music</p>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.52985 3.22032C9.6703 3.36094 9.74919 3.55157 9.74919 3.75032C9.74919 3.94907 9.6703 4.13969 9.52985 4.28032L5.02985 8.78032C4.88922 8.92077 4.6986 8.99966 4.49985 8.99966C4.3011 8.99966 4.11047 8.92077 3.96985 8.78032L2.46985 7.28032C2.33737 7.13814 2.26524 6.9501 2.26867 6.75579C2.2721 6.56149 2.35081 6.37611 2.48822 6.23869C2.62564 6.10128 2.81102 6.02257 3.00532 6.01914C3.19963 6.01571 3.38767 6.08784 3.52985 6.22032L4.49985 7.19032L8.46985 3.22032C8.61047 3.07987 8.8011 3.00098 8.99985 3.00098C9.1986 3.00098 9.38922 3.07987 9.52985 3.22032Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="tray-item">
                <p className="bold">Folders</p>
              </div>
              <div className="tray-item">
                <p className="bold">Games</p>
              </div>
              <div className="tray-item">
                <p className="bold">Papers</p>
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
            <div className="glow-gradient">
              <svg
                width="100%"
                viewBox="0 0 130 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g style={{ mixBlendMode: "color-dodge" }}>
                  <rect
                    width="130"
                    height="130"
                    fill="url(#paint0_linear_641_2)"
                  />
                  <rect
                    width="130"
                    height="130"
                    fill="url(#paint1_linear_641_2)"
                  />
                  <rect
                    width="130"
                    height="130"
                    fill="url(#paint2_linear_641_2)"
                  />
                  <rect
                    width="130"
                    height="130"
                    fill="url(#paint3_linear_641_2)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_641_2"
                    x1="65"
                    y1="0"
                    x2="65"
                    y2="130"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.254808" stopColor="#2D323D" />
                    <stop offset="0.4" stopColor="#2D323D" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_641_2"
                    x1="65"
                    y1="0"
                    x2="65"
                    y2="130"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.6" stopColor="#2D323D" stopOpacity="0" />
                    <stop offset="0.745192" stopColor="#2D323D" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_641_2"
                    x1="130"
                    y1="65"
                    x2="0"
                    y2="65"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0.596154"
                      stopColor="#2D323D"
                      stopOpacity="0"
                    />
                    <stop offset="0.745192" stopColor="#2D323D" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_641_2"
                    x1="130"
                    y1="65"
                    x2="0"
                    y2="65"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.254808" stopColor="#2D323D" />
                    <stop
                      offset="0.401755"
                      stopColor="#2D323D"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
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
