"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function ButtonToggleComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const buttons = root.querySelectorAll(
      ".button",
    ) as NodeListOf<HTMLDivElement>;
    if (buttons.length === 0) {
      return;
    }

    const timeouts: number[] = [];
    const buttonCleanup = new Map<HTMLDivElement, () => void>();

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const press = (item: HTMLDivElement) => {
      const icon = item.querySelector(".button-knob svg") as SVGElement | null;
      const knob = item.querySelector(
        ".button-knob > div",
      ) as HTMLElement | null;
      if (!icon || !knob) {
        return;
      }

      icon.style.transform = "scale(0.91)";
      knob.style.filter = "brightness(0.7)";
      knob.style.boxShadow =
        "inset 0 -0.5px 1px 1px rgba(0,0,0,0.6), inset 0 -8px 16px rgba(255,255,255,0.7), inset 4px 4px 4px 2px rgba(0,0,0,0.8)";
    };

    const release = (item: HTMLDivElement) => {
      const icon = item.querySelector(".button-knob svg") as SVGElement | null;
      const knob = item.querySelector(
        ".button-knob > div",
      ) as HTMLElement | null;
      if (!icon || !knob) {
        return;
      }

      icon.style.transform = "scale(1)";
      knob.style.filter = "brightness(1)";
      knob.style.boxShadow =
        "inset 0 -0.5px 1px 1px rgba(0,0,0,0.6), inset 0 -8px 16px rgba(255,255,255,0.7), inset 0 0 0 0 rgba(0,0,0,0.8)";
    };

    const resetState = () => {
      buttons.forEach((button) => {
        release(button);
      });
    };

    const handleMouseDown = (item: HTMLDivElement) => {
      press(item);
    };

    const handleMouseUp = (item: HTMLDivElement) => {
      release(item);
    };

    const handleTouchStart = (item: HTMLDivElement) => {
      press(item);
    };

    const handleTouchEnd = (item: HTMLDivElement) => {
      const timeoutId = window.setTimeout(() => {
        release(item);
        const index = timeouts.indexOf(timeoutId);
        if (index !== -1) {
          timeouts.splice(index, 1);
        }
      }, 300);
      timeouts.push(timeoutId);
    };

    buttons.forEach((item) => {
      const onMouseDown = () => handleMouseDown(item);
      const onMouseUp = () => handleMouseUp(item);
      const onTouchStart = () => handleTouchStart(item);
      const onTouchEnd = () => handleTouchEnd(item);

      item.addEventListener("mousedown", onMouseDown);
      item.addEventListener("mouseup", onMouseUp);
      item.addEventListener("touchstart", onTouchStart);
      item.addEventListener("touchend", onTouchEnd);

      buttonCleanup.set(item, () => {
        item.removeEventListener("mousedown", onMouseDown);
        item.removeEventListener("mouseup", onMouseUp);
        item.removeEventListener("touchstart", onTouchStart);
        item.removeEventListener("touchend", onTouchEnd);
      });
    });

    resetState();

    return () => {
      clearScheduled();
      buttonCleanup.forEach((cleanup) => cleanup());
      resetState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="buttontoggle-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <main>
        <div className="nav">
          <div className="button">
            <div className="button-knob">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.6252 13.5762H6.3752C5.38108 13.5762 4.5752 14.3821 4.5752 15.3762V17.6262C4.5752 18.6203 5.38108 19.4262 6.3752 19.4262H8.6252C9.61931 19.4262 10.4252 18.6203 10.4252 17.6262V15.3762C10.4252 14.3821 9.61931 13.5762 8.6252 13.5762Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.6252 13.5762H15.3752C14.3811 13.5762 13.5752 14.3821 13.5752 15.3762V17.6262C13.5752 18.6203 14.3811 19.4262 15.3752 19.4262H17.6252C18.6193 19.4262 19.4252 18.6203 19.4252 17.6262V15.3762C19.4252 14.3821 18.6193 13.5762 17.6252 13.5762Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.6252 4.57617H6.3752C5.38108 4.57617 4.5752 5.38206 4.5752 6.37617V8.62617C4.5752 9.62028 5.38108 10.4262 6.3752 10.4262H8.6252C9.61931 10.4262 10.4252 9.62028 10.4252 8.62617V6.37617C10.4252 5.38206 9.61931 4.57617 8.6252 4.57617Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.6252 4.57617H15.3752C14.3811 4.57617 13.5752 5.38206 13.5752 6.37617V8.62617C13.5752 9.62028 14.3811 10.4262 15.3752 10.4262H17.6252C18.6193 10.4262 19.4252 9.62028 19.4252 8.62617V6.37617C19.4252 5.38206 18.6193 4.57617 17.6252 4.57617Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="button">
            <div className="button-knob">
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6H21M9 12H21M9 18H17" strokeLinecap="round" />
                  <path
                    d="M4.70711 6.70711C4.51957 6.89464 4.26522 7 4 7C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5C4.26522 5 4.51957 5.10536 4.70711 5.29289C4.89464 5.48043 5 5.73478 5 6C5 6.26522 4.89464 6.51957 4.70711 6.70711Z"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.70711 12.7071C4.51957 12.8946 4.26522 13 4 13C3.73478 13 3.48043 12.8946 3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929C3.48043 11.1054 3.73478 11 4 11C4.26522 11 4.51957 11.1054 4.70711 11.2929C4.89464 11.4804 5 11.7348 5 12C5 12.2652 4.89464 12.5196 4.70711 12.7071Z"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.70711 18.7071C4.51957 18.8946 4.26522 19 4 19C3.73478 19 3.48043 18.8946 3.29289 18.7071C3.10536 18.5196 3 18.2652 3 18C3 17.7348 3.10536 17.4804 3.29289 17.2929C3.48043 17.1054 3.73478 17 4 17C4.26522 17 4.51957 17.1054 4.70711 17.2929C4.89464 17.4804 5 17.7348 5 18C5 18.2652 4.89464 18.5196 4.70711 18.7071Z"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
