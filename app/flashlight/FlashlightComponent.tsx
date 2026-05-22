"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function FlashlightComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const main = root.querySelector("main") as HTMLElement | null;
    const nav = root.querySelector(".nav") as HTMLElement | null;
    const buttons = root.querySelectorAll(".button") as NodeListOf<HTMLElement>;
    const light = root.querySelector(".light") as HTMLElement | null;
    const svgs = root.querySelectorAll(
      ".frame svg",
    ) as NodeListOf<SVGSVGElement>;
    const buttonLight = root.querySelector(
      ".button-light",
    ) as HTMLElement | null;
    const buttonLights = root.querySelectorAll(
      ".button-light div",
    ) as NodeListOf<HTMLElement>;

    if (!main || !nav || !light || !buttonLight || buttonLights.length === 0) {
      return;
    }

    const mainEl = main;
    const navEl = nav;
    const lightEl = light;
    const buttonLightTemplate = buttonLight;
    const buttonLightsCleanup = new Map<HTMLElement, () => void>();
    const glareLights: HTMLElement[] = [];
    const injectedSvgClones: SVGSVGElement[] = [];
    const timeouts: number[] = [];

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const resetState = () => {
      navEl.style.boxShadow = "";
      lightEl.style.transform = "";
      root.querySelectorAll(".button-light").forEach((item) => {
        (item as HTMLElement).style.opacity = "";
      });
      buttons.forEach((button) => {
        button.classList.remove("hover", "press");
        const buttonBg = button.querySelector(
          ".button-bg",
        ) as HTMLElement | null;
        if (buttonBg) {
          buttonBg.style.transform = "";
        }
      });
    };

    for (let i = 0; i < svgs.length; i++) {
      const svg = svgs[i].cloneNode(true) as SVGSVGElement;
      buttonLights[i].appendChild(svg);
      injectedSvgClones.push(svg);
    }

    for (let i = 0; i < 4; i++) {
      const newButtonLight = buttonLightTemplate.cloneNode(true) as HTMLElement;
      newButtonLight.classList.add("glare");
      newButtonLight.style.filter = `blur(${Math.pow(i * 1.5, 2)}px)`;
      mainEl.appendChild(newButtonLight);
      glareLights.push(newButtonLight);
    }

    const buttonLightsAll = root.querySelectorAll(
      ".button-light",
    ) as NodeListOf<HTMLElement>;

    function calculateShadow(
      cursorX: number,
      cursorY: number,
      rootRect: DOMRect,
    ) {
      const rect = navEl.getBoundingClientRect();
      const centerX = rect.left - rootRect.left + rect.width / 2;
      const centerY = rect.top - rootRect.top + rect.height / 2;
      const deltaX = cursorX - centerX;
      const deltaY = cursorY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const maxOffset = 3;
      const detectionRadius = rect.width * 2;
      const distance = Math.min(
        maxOffset,
        (Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius) * maxOffset,
      );
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      return { x: -offsetX, y: -offsetY };
    }

    function calculateIntensity(
      cursorX: number,
      cursorY: number,
      innerRadius: number,
      outerRadius: number,
      rootRect: DOMRect,
    ) {
      const rect = navEl.getBoundingClientRect();
      const centerX = rect.left - rootRect.left + rect.width / 2;
      const centerY = rect.top - rootRect.top + rect.height / 2;
      const deltaX = cursorX - centerX;
      const deltaY = cursorY - centerY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance > innerRadius && distance <= outerRadius) {
        return (distance - innerRadius) / (outerRadius - innerRadius);
      }

      if (distance > outerRadius) {
        return 1;
      }

      return 0;
    }

    function calculateAngle(
      element: HTMLElement,
      cursorX: number,
      cursorY: number,
      rootRect: DOMRect,
    ) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left - rootRect.left + rect.width / 2;
      const centerY = rect.top - rootRect.top + rect.height / 2;
      const angle =
        Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI);
      return (angle + 180) % 360;
    }

    function easeOutQuint(t: number) {
      return 1 - Math.pow(1 - t, 5);
    }

    function easeInQuad(t: number) {
      return t * t;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rootRect = root.getBoundingClientRect();
      const x = event.clientX - rootRect.left;
      const y = event.clientY - rootRect.top;
      lightEl.style.transform = `translate(${x}px,${y}px)`;

      const s = calculateShadow(x, y, rootRect);
      const shadow = `
  ${s.x * 2.6}px ${s.y * 2.6}px 1.5px rgba(0, 0, 0, 0.081),
  ${s.x * 5.8}px ${s.y * 5.8}px 3.4px rgba(0, 0, 0, 0.12),
  ${s.x * 9.8}px ${s.y * 9.8}px 5.6px rgba(0, 0, 0, 0.15),
  ${s.x * 14.8}px ${s.y * 14.8}px 8.5px rgba(0, 0, 0, 0.174),
  ${s.x * 21.3}px ${s.y * 21.3}px 12.3px rgba(0, 0, 0, 0.195),
  ${s.x * 30.1}px ${s.y * 30.1}px 17.4px rgba(0, 0, 0, 0.216),
  ${s.x * 42.7}px ${s.y * 42.7}px 24.6px rgba(0, 0, 0, 0.24),
  ${s.x * 62.1}px ${s.y * 62.1}px 35.8px rgba(0, 0, 0, 0.27),
  ${s.x * 95.6}px ${s.y * 95.6}px 55.1px rgba(0, 0, 0, 0.309),
  ${s.x * 170}px ${s.y * 170}px 98px rgba(0, 0, 0, 0.39)
`;
      navEl.style.boxShadow = shadow;

      const lightRadius = 400;

      const opacity = easeInQuad(
        calculateIntensity(x, y, lightRadius / 3, lightRadius * 1.3, rootRect),
      );
      for (let i = 0; i < buttonLightsAll.length; i++) {
        buttonLightsAll[i].style.opacity = `${opacity}`;
      }

      buttons.forEach((item) => {
        const angle = calculateAngle(item, x, y, rootRect);
        const scaleY =
          10 -
          easeOutQuint(
            calculateIntensity(x, y, 0, lightRadius * 1.4, rootRect),
          ) *
            10;
        const buttonBg = item.querySelector(".button-bg") as HTMLElement;
        buttonBg.style.transform = `rotateZ(${angle}deg) scaleY(${scaleY})`;
      });
    };

    const handleButtonMouseOver = (item: HTMLElement) => {
      item.classList.add("hover");
    };

    const handleButtonMouseOut = (item: HTMLElement) => {
      item.classList.remove("hover");
    };

    const handleButtonMouseDown = (item: HTMLElement) => {
      item.classList.add("press");
    };

    const handleButtonMouseUp = (item: HTMLElement) => {
      item.classList.remove("press");
    };

    const handleButtonTouchStart = (item: HTMLElement) => {
      item.classList.add("press");
    };

    const handleButtonTouchEnd = (item: HTMLElement) => {
      const timeoutId = window.setTimeout(() => {
        item.classList.add("hover");
        item.classList.remove("press");
        const index = timeouts.indexOf(timeoutId);
        if (index !== -1) {
          timeouts.splice(index, 1);
        }
      }, 300);
      timeouts.push(timeoutId);
    };

    root.addEventListener("mousemove", handleMouseMove);

    buttons.forEach((item) => {
      const onMouseOver = () => handleButtonMouseOver(item);
      const onMouseOut = () => handleButtonMouseOut(item);
      const onMouseDown = () => handleButtonMouseDown(item);
      const onMouseUp = () => handleButtonMouseUp(item);
      const onTouchStart = () => handleButtonTouchStart(item);
      const onTouchEnd = () => handleButtonTouchEnd(item);

      item.addEventListener("mouseover", onMouseOver);
      item.addEventListener("mouseout", onMouseOut);
      item.addEventListener("mousedown", onMouseDown);
      item.addEventListener("mouseup", onMouseUp);
      item.addEventListener("touchstart", onTouchStart);
      item.addEventListener("touchend", onTouchEnd);

      buttonLightsCleanup.set(item, () => {
        item.removeEventListener("mouseover", onMouseOver);
        item.removeEventListener("mouseout", onMouseOut);
        item.removeEventListener("mousedown", onMouseDown);
        item.removeEventListener("mouseup", onMouseUp);
        item.removeEventListener("touchstart", onTouchStart);
        item.removeEventListener("touchend", onTouchEnd);
        item.classList.remove("press");
      });
    });

    resetState();

    return () => {
      clearScheduled();
      root.removeEventListener("mousemove", handleMouseMove);
      buttonLightsCleanup.forEach((cleanup) => cleanup());
      injectedSvgClones.forEach((svg) => svg.remove());
      glareLights.forEach((glare) => glare.remove());
      resetState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="flashlight-root"
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
            <img
              className="button-bg"
              src="https://cdn.prod.website-files.com/65cceef869e5a56037c32801/672080ee3e9942d6e0617400_Rectangle%201002.png"
            />
            <div className="frame">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 6H21M9 12H21M9 18H17" />
                <path d="M4.35355 6.35355C4.25979 6.44732 4.13261 6.5 4 6.5C3.86739 6.5 3.74021 6.44732 3.64645 6.35355C3.55268 6.25979 3.5 6.13261 3.5 6C3.5 5.86739 3.55268 5.74021 3.64645 5.64645C3.74021 5.55268 3.86739 5.5 4 5.5C4.13261 5.5 4.25979 5.55268 4.35355 5.64645C4.44732 5.74021 4.5 5.86739 4.5 6C4.5 6.13261 4.44732 6.25979 4.35355 6.35355Z" />
                <path d="M4.35355 12.3536C4.25979 12.4473 4.13261 12.5 4 12.5C3.86739 12.5 3.74021 12.4473 3.64645 12.3536C3.55268 12.2598 3.5 12.1326 3.5 12C3.5 11.8674 3.55268 11.7402 3.64645 11.6464C3.74021 11.5527 3.86739 11.5 4 11.5C4.13261 11.5 4.25979 11.5527 4.35355 11.6464C4.44732 11.7402 4.5 11.8674 4.5 12C4.5 12.1326 4.44732 12.2598 4.35355 12.3536Z" />
                <path d="M4.35355 18.3536C4.25979 18.4473 4.13261 18.5 4 18.5C3.86739 18.5 3.74021 18.4473 3.64645 18.3536C3.55268 18.2598 3.5 18.1326 3.5 18C3.5 17.8674 3.55268 17.7402 3.64645 17.6464C3.74021 17.5527 3.86739 17.5 4 17.5C4.13261 17.5 4.25979 17.5527 4.35355 17.6464C4.44732 17.7402 4.5 17.8674 4.5 18C4.5 18.1326 4.44732 18.2598 4.35355 18.3536Z" />
              </svg>
            </div>
          </div>
          <div className="button">
            <img
              className="button-bg"
              src="https://cdn.prod.website-files.com/65cceef869e5a56037c32801/672080ee3e9942d6e0617400_Rectangle%201002.png"
            />
            <div className="frame">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.6252 13.5762H6.3752C5.38108 13.5762 4.5752 14.3821 4.5752 15.3762V17.6262C4.5752 18.6203 5.38108 19.4262 6.3752 19.4262H8.6252C9.61931 19.4262 10.4252 18.6203 10.4252 17.6262V15.3762C10.4252 14.3821 9.61931 13.5762 8.6252 13.5762Z" />
                <path d="M17.6252 13.5762H15.3752C14.3811 13.5762 13.5752 14.3821 13.5752 15.3762V17.6262C13.5752 18.6203 14.3811 19.4262 15.3752 19.4262H17.6252C18.6193 19.4262 19.4252 18.6203 19.4252 17.6262V15.3762C19.4252 14.3821 18.6193 13.5762 17.6252 13.5762Z" />
                <path d="M8.6252 4.57617H6.3752C5.38108 4.57617 4.5752 5.38206 4.5752 6.37617V8.62617C4.5752 9.62028 5.38108 10.4262 6.3752 10.4262H8.6252C9.61931 10.4262 10.4252 9.62028 10.4252 8.62617V6.37617C10.4252 5.38206 9.61931 4.57617 8.6252 4.57617Z" />
                <path d="M17.6252 4.57617H15.3752C14.3811 4.57617 13.5752 5.38206 13.5752 6.37617V8.62617C13.5752 9.62028 14.3811 10.4262 15.3752 10.4262H17.6252C18.6193 10.4262 19.4252 9.62028 19.4252 8.62617V6.37617C19.4252 5.38206 18.6193 4.57617 17.6252 4.57617Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="light"></div>

        <div className="button-light">
          <div></div>
          <div></div>
        </div>
      </main>
    </div>
  );
}
