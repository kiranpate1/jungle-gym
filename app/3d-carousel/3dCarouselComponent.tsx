"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function Carousel3dComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const container = root.querySelector(
      ".scroll-container",
    ) as HTMLElement | null;
    const selectors = root.querySelector(".selectors") as HTMLElement | null;
    const title = root.querySelector("h1") as HTMLElement | null;

    if (!container || !selectors || !title) {
      return;
    }

    const containerElement = container;
    const selectorsElement = selectors;
    const titleElement = title;

    const containerItems = root.querySelectorAll(
      ".scroll-container > div",
    ) as NodeListOf<HTMLElement>;

    if (containerItems.length === 0) {
      return;
    }

    selectorsElement.innerHTML = "";

    containerItems.forEach(() => {
      const selector = document.createElement("div");
      selector.classList.add("selector");
      selectorsElement.appendChild(selector);
    });

    const selectorsAll = selectorsElement.querySelectorAll(
      ".selector",
    ) as NodeListOf<HTMLElement>;
    let containerHalf = 0;
    let containerItemsLeft: number[] = [];
    const cleanupImageListeners: Array<() => void> = [];
    let rafIdA = 0;
    let rafIdB = 0;
    let settleTimeoutId = 0;

    function calculateMeasurements() {
      containerHalf = containerElement.clientWidth / 4;
      containerItemsLeft = Array.from(containerItems).map((item) => {
        return item.offsetLeft - containerHalf;
      });
    }

    const easeInOutQuint = (t: number) => {
      let easedTime = t / 0.5;
      if (easedTime < 1) {
        return 0.5 * Math.pow(easedTime, 5);
      }

      easedTime -= 2;
      return 0.5 * (Math.pow(easedTime, 5) + 2);
    };

    const animate = () => {
      const scrollProgress = containerElement.scrollLeft + containerHalf;

      containerItems.forEach((item, i) => {
        const img = item.querySelector("img") as HTMLElement | null;
        const selector = selectorsAll[i];
        if (!img || !selector) {
          return;
        }

        const start = containerItemsLeft[i] + 100;
        const end = start + 300;
        const approaching = start - 400;
        const leaving = end + 400;
        const translateZ = 300;
        const rotateY = 60;
        const blur = 20;

        if (scrollProgress < approaching) {
          img.style.transform = `translateX(100%) translateZ(${-translateZ}px) rotateY(0deg)`;
          img.style.filter = `blur(${blur}px)`;
          selector.style.opacity = "0.25";
        }

        if (scrollProgress > approaching && scrollProgress <= start) {
          const progress = Math.min(
            (scrollProgress - approaching) / (start - approaching),
            1,
          );
          const ease = easeInOutQuint(progress);
          img.style.transformOrigin = `${100 - ease * 100}% center`;

          if (progress < 0.5) {
            img.style.transform = `translateX(${100 - ease * 50}%) translateZ(${-translateZ + ease * translateZ}px) rotateY(${progress * rotateY}deg)`;
          } else {
            img.style.transform = `translateX(${100 - ease * 50}%) translateZ(${-translateZ + ease * translateZ}px) rotateY(${rotateY - progress * rotateY}deg)`;
          }

          img.style.filter = `blur(${blur - ease * blur}px)`;
          selector.style.opacity = "0.25";
        }

        if (scrollProgress > start && scrollProgress < end) {
          img.style.transform = "translateX(50%) translateZ(0px) rotateY(0deg)";
          img.style.filter = "blur(0px)";
          selector.style.opacity = "1";
          titleElement.textContent = img.getAttribute("alt") ?? "";
        }

        if (scrollProgress >= end && scrollProgress < leaving) {
          const progress = Math.min(
            (scrollProgress - end) / (leaving - end),
            1,
          );
          const ease = easeInOutQuint(progress);
          img.style.transformOrigin = `${100 - ease * 100}% center`;

          if (progress < 0.5) {
            img.style.transform = `translateX(${50 - ease * 50}%) translateZ(${-ease * translateZ}px) rotateY(${-progress * rotateY}deg)`;
          } else {
            img.style.transform = `translateX(${50 - ease * 50}%) translateZ(${-ease * translateZ}px) rotateY(${-rotateY + progress * rotateY}deg)`;
          }

          img.style.filter = `blur(${ease * blur}px)`;
          selector.style.opacity = "0.25";
        }

        if (scrollProgress > leaving) {
          img.style.transform = `translateX(0%) translateZ(${-translateZ}px) rotateY(0deg)`;
          img.style.filter = `blur(${blur}px)`;
          selector.style.opacity = "0.25";
        }
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      containerElement.scrollLeft += event.deltaY;
      animate();
    };

    const handleResize = () => {
      calculateMeasurements();
      animate();
    };

    const scheduleRecalculate = () => {
      cancelAnimationFrame(rafIdA);
      cancelAnimationFrame(rafIdB);

      // Wait for layout to settle inside the modal's opening transition.
      rafIdA = requestAnimationFrame(() => {
        rafIdB = requestAnimationFrame(() => {
          handleResize();
        });
      });
    };

    const resetCarouselState = () => {
      selectorsElement.innerHTML = "";
      titleElement.textContent = "";
      containerItems.forEach((item) => {
        const img = item.querySelector("img") as HTMLElement | null;
        if (!img) {
          return;
        }

        img.style.transform = "";
        img.style.filter = "";
        img.style.transformOrigin = "";
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      scheduleRecalculate();
    });

    resizeObserver.observe(root);
    resizeObserver.observe(containerElement);

    containerItems.forEach((item) => {
      const img = item.querySelector("img") as HTMLImageElement | null;
      if (!img || img.complete) {
        return;
      }

      const handleImageReady = () => {
        scheduleRecalculate();
      };

      img.addEventListener("load", handleImageReady);
      img.addEventListener("error", handleImageReady);

      cleanupImageListeners.push(() => {
        img.removeEventListener("load", handleImageReady);
        img.removeEventListener("error", handleImageReady);
      });
    });

    calculateMeasurements();
    animate();
    scheduleRecalculate();
    settleTimeoutId = window.setTimeout(() => {
      handleResize();
    }, 450);
    containerElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      cleanupImageListeners.forEach((cleanup) => cleanup());
      cancelAnimationFrame(rafIdA);
      cancelAnimationFrame(rafIdB);
      window.clearTimeout(settleTimeoutId);
      containerElement.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      resetCarouselState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="carousel3d-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="selectors"></div>
      <div className="scroll-container">
        <div>
          <img
            src="https://assets.vogue.com/photos/64efa2113e89acbbb62489f4/master/w_1600%2Cc_limit/beyonce-marni-parkwood.jpg"
            alt="Marni"
          />
        </div>
        <div>
          <img
            src="https://assets.vogue.com/photos/64cbcf9934738028f805d911/master/w_1600%2Cc_limit/beyonce-dundas-parkwood%2520entertainment.jpeg"
            alt="DUNDAS"
          />
        </div>
        <div>
          <img
            src="https://www.redcarpet-fashionawards.com/wp-content/uploads/2023/09/Beyonce-Mugler.jpg"
            alt="Mugler"
          />
        </div>
        <div>
          <img
            src="https://hips.hearstapps.com/hmg-prod/images/362385712-1701964706892614-564253150938300928-n-64bd49b082932.jpg"
            alt="Alexander McQueen"
          />
        </div>
        <div>
          <img
            src="https://www.thesun.co.uk/wp-content/uploads/2023/08/beyonce_370593320_18431232178008035_5937122429800621287_njpg-JS840516919.jpg?strip=all&w=768"
            alt="Gareth Pugh"
          />
        </div>
        <div>
          <img
            src="https://www.thesun.co.uk/wp-content/uploads/2023/08/beyonce_370232065_18431230537008035_5756532687445147372_njpg-JS840516988.jpg?strip=all&w=768"
            alt="Situationist x Yaspis"
          />
        </div>
        <div>
          <img
            src="https://www.vibe.com/wp-content/uploads/2023/09/Screen-Shot-2023-09-25-at-9.39.40-AM.png?w=800"
            alt="BOSS"
          />
        </div>
      </div>
      <h1></h1>
    </div>
  );
}
