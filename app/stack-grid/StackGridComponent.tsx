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

    const data = [
      {
        album: "Taylor Swift",
        photo:
          "https://upload.wikimedia.org/wikipedia/en/1/1f/Taylor_Swift_-_Taylor_Swift.png",
        color: "#0D271C",
      },
      {
        album: "Fearless",
        photo:
          "https://media.newyorker.com/photos/60747954c920e996bd1e486d/1:1/w_1326,h_1326,c_limit/Battan-FearlessTaylorsVersion.jpg",
        color: "#5D3D21",
      },
      {
        album: "Speak Now",
        photo:
          "https://cdn.shoplightspeed.com/shops/635403/files/60549215/rock-pop-taylor-swift-speak-now-taylors-version-3l.jpg",
        color: "#1C0C13",
      },
      {
        album: "Red",
        photo:
          "https://i.scdn.co/image/ab67616d00001e02318443aab3531a0558e79a4d",
        color: "#480300",
      },
      {
        album: "1989",
        photo:
          "https://m.media-amazon.com/images/I/81JNBy4njYL._UF1000,1000_QL80_.jpg",
        color: "#385874",
      },
      {
        album: "Reputation",
        photo:
          "https://www.brit.co/media-library/reputation-taylor-s-version.jpg?id=50724916&width=980",
        color: "#434343",
      },
      {
        album: "Lover",
        photo:
          "https://upload.wikimedia.org/wikipedia/en/c/cd/Taylor_Swift_-_Lover.png",
        color: "#A64873",
      },
      {
        album: "Folklore",
        photo:
          "https://http2.mlstatic.com/D_NQ_NP_634994-MLU75051522908_032024-O.webp",
        color: "#52514A",
      },
      {
        album: "Evermore",
        photo:
          "https://mediacdn.aent-m.com/prod-img/500/88/3948988-3244567.jpg",
        color: "#5F2B22",
      },
      {
        album: "Midnights",
        photo:
          "https://preview.redd.it/updated-the-midnights-album-cover-with-all-the-tracks-this-v0-3c0nstqk9dw91.png?width=1414&format=png&auto=webp&s=28bec34abcbb3b2a3d75eb0575a662a73655b831",
        color: "#4A314E",
      },
      {
        album: "The Tortured Poets Department",
        photo: "https://taypedia.com/wp-content/uploads/2024/05/ttpd4.jpeg",
        color: "#312F29",
      },
    ];

    const content = root.querySelector(".content") as HTMLDivElement | null;
    const templateItem = root.querySelector(".item") as HTMLDivElement | null;
    const topBar = root.querySelector(".top") as HTMLDivElement | null;
    const toggleCarouselButton = root.querySelector(
      "#toggle-carousel",
    ) as HTMLDivElement | null;
    const toggleGridButton = root.querySelector(
      "#toggle-grid",
    ) as HTMLDivElement | null;

    if (
      !content ||
      !templateItem ||
      !toggleCarouselButton ||
      !toggleGridButton
    ) {
      return;
    }

    const originalSelectStart = document.onselectstart;
    const originalBodyBackground = root.style.background;
    const originalCellSize = root.style.getPropertyValue("--cell-size");
    const originalGridOffset = root.style.getPropertyValue("--grid-y-offset");
    const hadScrollClass = root.classList.contains("scroll");
    const hadGridClass = root.classList.contains("grid");
    const templateItemClone = templateItem.cloneNode(true) as HTMLDivElement;

    const timeouts: number[] = [];
    const intervals: number[] = [];

    let animationFrameId: number | null = null;
    let pendingTransitionEnd: (() => void) | null = null;
    let cellSize = 0;
    let columns = 4;
    let rows = 0;
    let gridYOffset = 76;
    let isActive = false;
    let isDragging = false;
    let currentPos = 0;
    let momentum = 0;

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      intervals.forEach((intervalId) => window.clearInterval(intervalId));
      timeouts.length = 0;
      intervals.length = 0;
    };

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = window.setTimeout(() => {
        callback();
        const index = timeouts.indexOf(timeoutId);
        if (index !== -1) {
          timeouts.splice(index, 1);
        }
      }, delayMs);
      timeouts.push(timeoutId);
      return timeoutId;
    };

    const scheduleInterval = (callback: () => void, delayMs: number) => {
      const intervalId = window.setInterval(callback, delayMs);
      intervals.push(intervalId);
      return intervalId;
    };

    document.onselectstart = () => false;

    const getGridGap = () => {
      const rootGap = parseInt(
        getComputedStyle(root).getPropertyValue("--grid-gap"),
        10,
      );
      if (!Number.isNaN(rootGap)) {
        return rootGap;
      }

      return 0;
    };

    const getRootRect = () => root.getBoundingClientRect();

    const getContentTranslateX = () => {
      const transform = getComputedStyle(content).transform;
      if (transform === "none") {
        return 0;
      }

      return new DOMMatrixReadOnly(transform).m41;
    };

    const getClientX = (event: MouseEvent | TouchEvent) => {
      if (event instanceof TouchEvent) {
        return (
          event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0
        );
      }

      return event.clientX;
    };

    const buildContent = () => {
      content.replaceChildren();

      const middleIndex = Math.floor(data.length / 2);

      data.forEach((entry, index) => {
        const newItem = templateItemClone.cloneNode(true) as HTMLDivElement;
        const image = newItem.querySelector("img") as HTMLImageElement | null;
        const title = newItem.querySelector("h1") as HTMLHeadingElement | null;
        const imageContainer = newItem.querySelector(
          ".image",
        ) as HTMLDivElement | null;

        if (!image || !title || !imageContainer) {
          return;
        }

        const zIndex = data.length - Math.abs(index - middleIndex);
        newItem.style.zIndex = `${zIndex}`;
        image.src = entry.photo;
        title.innerHTML = entry.album;

        const backgroundImage = image.cloneNode(true) as HTMLImageElement;
        backgroundImage.classList.add("bg-img");
        imageContainer.appendChild(backgroundImage);
        content.appendChild(newItem);
      });
    };

    buildContent();

    const windows = Array.from(
      root.querySelectorAll<HTMLDivElement>(".window"),
    );
    const items = Array.from(root.querySelectorAll<HTMLDivElement>(".item"));

    const resetState = () => {
      isActive = false;
      isDragging = false;
      momentum = 0;
      content.style.cursor = "";
      content.style.transition = "";
      content.style.transform = "";

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (pendingTransitionEnd) {
        content.removeEventListener("transitionend", pendingTransitionEnd);
        pendingTransitionEnd = null;
      }

      windows.forEach((windowItem, index) => {
        const imageElement = windowItem.querySelector(
          ".image",
        ) as HTMLDivElement | null;
        const infoElement = windowItem.querySelector(
          ".info",
        ) as HTMLDivElement | null;

        windowItem.style.transition = "";
        windowItem.style.transform = "";
        windowItem.style.background = "";

        if (imageElement) {
          imageElement.style.opacity = "";
        }
        if (infoElement) {
          infoElement.style.opacity = "";
        }
        if (items[index]) {
          items[index].style.zIndex = "";
        }
      });

      root.style.background = originalBodyBackground;
      root.classList.toggle("scroll", hadScrollClass);
      root.classList.toggle("grid", hadGridClass);

      if (originalCellSize) {
        root.style.setProperty("--cell-size", originalCellSize);
      } else {
        root.style.removeProperty("--cell-size");
      }

      if (originalGridOffset) {
        root.style.setProperty("--grid-y-offset", originalGridOffset);
      } else {
        root.style.removeProperty("--grid-y-offset");
      }
    };

    const getCenterDistance = (item: HTMLDivElement) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const rootRect = getRootRect();
      const viewportCenter = rootRect.left + rootRect.width / 2;
      return viewportCenter - itemCenter;
    };

    const getClosestItemIndex = () => {
      let closestIndex = 0;
      let minDistance = Infinity;

      windows.forEach((windowItem, index) => {
        const distance = Math.abs(getCenterDistance(windowItem));
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const translateWindow = (
      item: HTMLDivElement,
      index: number,
      activeIndex: number,
    ) => {
      const distanceToCenter = Math.abs(getCenterDistance(item));
      const rootRect = getRootRect();
      const factor = Math.max(
        0,
        1 - distanceToCenter / Math.max(rootRect.width, 1),
      );
      const scale = Math.max(0.6, Math.pow(factor, 2.25));
      const zIndex = Math.round(factor * 100);
      const imageElement = item.querySelector(
        ".image",
      ) as HTMLDivElement | null;
      const infoElement = item.querySelector(".info") as HTMLDivElement | null;
      const imageOpacity = factor > 0.99 ? 1 : Math.max(0, (factor - 0.85) * 2);

      if (imageElement) {
        imageElement.style.opacity = `${imageOpacity}`;
      }
      if (infoElement) {
        infoElement.style.opacity = index === activeIndex ? "1" : "0";
      }

      item.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
      if (items[index]) {
        items[index].style.zIndex = `${zIndex}`;
      }
    };

    const applyActiveColors = (activeIndex: number) => {
      root.style.background = data[activeIndex].color;
      windows.forEach((windowItem) => {
        windowItem.style.background = `${data[activeIndex].color}30`;
      });
    };

    const renderCarouselFrame = () => {
      const activeIndex = getClosestItemIndex();

      windows.forEach((windowItem, index) => {
        translateWindow(windowItem, index, activeIndex);
      });

      applyActiveColors(activeIndex);
    };

    const updateCarousel = () => {
      if (!isActive) {
        return;
      }

      renderCarouselFrame();

      animationFrameId = window.requestAnimationFrame(updateCarousel);
    };

    const moveCarousel = (delta: number) => {
      const currentTransform = getContentTranslateX();
      content.style.transform = `translateX(${currentTransform + delta}px)`;
    };

    const snapToClosestItem = () => {
      const closestIndex = getClosestItemIndex();
      const distance = getCenterDistance(windows[closestIndex]);
      const currentTransform = getContentTranslateX();

      if (pendingTransitionEnd) {
        content.removeEventListener("transitionend", pendingTransitionEnd);
      }

      content.style.transition = "transform 0.3s ease";
      content.style.transform = `translateX(${currentTransform + distance}px)`;

      pendingTransitionEnd = () => {
        content.style.transition = "";
        if (pendingTransitionEnd) {
          content.removeEventListener("transitionend", pendingTransitionEnd);
          pendingTransitionEnd = null;
        }
      };

      content.addEventListener("transitionend", pendingTransitionEnd);
    };

    const stopMomentum = () => {
      intervals.forEach((intervalId) => window.clearInterval(intervalId));
      intervals.length = 0;
    };

    const startDrag = (event: MouseEvent | TouchEvent) => {
      if (!isActive) {
        return;
      }

      stopMomentum();
      isDragging = true;
      content.style.cursor = "grab";
      currentPos = getClientX(event);
    };

    const onDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDragging || !isActive) {
        return;
      }

      content.style.cursor = "grabbing";
      const position = getClientX(event);
      const delta = position - currentPos;
      currentPos = position;
      momentum = delta;
      moveCarousel(delta);
    };

    const endDrag = () => {
      if (!isActive) {
        return;
      }

      isDragging = false;
      content.style.cursor = "grab";

      const momentumInterval = scheduleInterval(() => {
        if (Math.abs(momentum) < 0.5) {
          window.clearInterval(momentumInterval);
          const index = intervals.indexOf(momentumInterval);
          if (index !== -1) {
            intervals.splice(index, 1);
          }
          snapToClosestItem();
          momentum = 0;
          return;
        }

        moveCarousel(momentum);
        momentum *= 0.9;
      }, 16);
    };

    const attachInteractionListeners = () => {
      content.addEventListener("touchstart", startDrag);
      content.addEventListener("touchmove", onDrag);
      content.addEventListener("touchend", endDrag);
      content.addEventListener("mousedown", startDrag);
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", endDrag);
    };

    const detachInteractionListeners = () => {
      content.removeEventListener("touchstart", startDrag);
      content.removeEventListener("touchmove", onDrag);
      content.removeEventListener("touchend", endDrag);
      content.removeEventListener("mousedown", startDrag);
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", endDrag);
    };

    const applyGridLayout = () => {
      rows = Math.ceil(windows.length / columns);

      windows.forEach((windowItem, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const x = column * cellSize - (columns * cellSize) / 2 + cellSize / 2;
        const y =
          row * cellSize - (rows * cellSize) / 2 + cellSize / 2 + gridYOffset;

        windowItem.style.transform = `translate3d(${x}px,${y}px,0) scale(1)`;
      });
    };

    const setCarouselState = (nextState: boolean) => {
      isActive = nextState;
      stopMomentum();

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (nextState) {
        attachInteractionListeners();
        content.style.transition = "var(--transition)";
        root.classList.add("scroll");
        root.classList.remove("grid");

        windows.forEach((windowItem, index) => {
          windowItem.style.transition = "var(--transition)";
          windowItem.style.transform = "translate3d(0, 0, 0)";

          scheduleTimeout(() => {
            const activeIndex = getClosestItemIndex();
            translateWindow(windowItem, index, activeIndex);
            if (index === windows.length - 1) {
              applyActiveColors(activeIndex);
            }
          }, 400);

          scheduleTimeout(() => {
            windowItem.style.transition = "0s";
            content.style.transition = "0s";

            if (animationFrameId === null) {
              updateCarousel();
            }
          }, 800);
        });

        return;
      }

      detachInteractionListeners();
      content.style.transition = "var(--transition)";
      root.classList.remove("scroll");
      root.classList.add("grid");

      windows.forEach((windowItem) => {
        windowItem.style.transition = "var(--transition)";
      });

      scheduleTimeout(() => {
        windows.forEach((windowItem) => {
          windowItem.style.transition = "0s";
        });
        content.style.transition = "0s";
      }, 400);

      applyGridLayout();
    };

    const handleResize = () => {
      const gridGap = getGridGap();
      const rootRect = getRootRect();
      const modalWidth = rootRect.width;

      if (modalWidth > 1000) {
        cellSize = modalWidth / 4 - gridGap;
        columns = 4;
      } else if (modalWidth > 600) {
        cellSize = modalWidth / 3 - gridGap;
        columns = 3;
      } else {
        cellSize = modalWidth / 2 - gridGap;
        columns = 2;
      }

      cellSize = Math.max(120, cellSize);
      gridYOffset = (topBar?.offsetHeight ?? 52) + 24;

      root.style.setProperty("--cell-size", `${cellSize}px`);
      root.style.setProperty("--grid-y-offset", `${gridYOffset}px`);

      if (isActive) {
        renderCarouselFrame();
        return;
      }

      applyGridLayout();
    };

    const handleCarouselClick = () => {
      setCarouselState(true);
    };

    const handleGridClick = () => {
      setCarouselState(false);
    };

    toggleCarouselButton.addEventListener("click", handleCarouselClick);
    toggleGridButton.addEventListener("click", handleGridClick);
    window.addEventListener("resize", handleResize);

    handleResize();
    setCarouselState(false);

    return () => {
      toggleCarouselButton.removeEventListener("click", handleCarouselClick);
      toggleGridButton.removeEventListener("click", handleGridClick);
      window.removeEventListener("resize", handleResize);
      detachInteractionListeners();
      clearScheduled();
      resetState();
      content.replaceChildren(templateItemClone.cloneNode(true));
      document.onselectstart = originalSelectStart;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="stackgrid-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="top">
        <p className="bold">Taylor Swift</p>
        <div className="type">
          <p className="light">Albums</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.71054 11.71L11.3005 14.3C11.6905 14.69 12.3205 14.69 12.7105 14.3L15.3005 11.71C15.9305 11.08 15.4805 10 14.5905 10H9.41054C8.52054 10 8.08054 11.08 8.71054 11.71Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div className="carousel">
        <div className="test">
          <div className="content">
            <div className="item">
              <div className="window">
                <div className="image">
                  <img alt="" />
                </div>
                <div className="info">
                  <h1></h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nav">
        <div className="bg"></div>
        <div id="toggle-carousel">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 20V18C20.103 18 21 17.103 21 16V8C21 6.897 20.103 6 19 6V4C19 2.897 18.103 2 17 2H7C5.897 2 5 2.897 5 4V6C3.897 6 3 6.897 3 8L3 16C3 17.103 3.897 18 5 18V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20ZM7 4H17V6H7V4ZM5 16L5 8L19 7.999V16H5ZM7 20V18H17V20H7Z"
              fill="white"
            />
          </svg>
        </div>
        <div id="toggle-grid">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="cover-scrim"></div>
    </div>
  );
}
