import { useEffect, useRef, useState, type RefObject } from "react";

type Props = {
  content: Title[];
  scrollRootRef: RefObject<HTMLDivElement | null>;
};

type Title = {
  title: HTMLElement;
  subtitles: NodeListOf<HTMLElement>;
};

const Navigation = ({ content, scrollRootRef }: Props) => {
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const [elementPositions, setElementPositions] = useState<number[]>([]);
  const [elementTypes, setElementTypes] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollProgressInElement, setScrollProgressInElement] = useState(0);
  const [subtitleHeights, setSubtitleHeights] = useState<number[]>([]);
  const [titleHeights, setTitleHeights] = useState<number[]>([]);
  const [collapsedPositions, setCollapsedPositions] = useState<number[]>([]);
  const [expandedPositions, setExpandedPositions] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    const updateHeightAndPositions = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);

        // Get positions of all nav elements
        const allNavElements = navRef.current.querySelectorAll(
          ".font-medium, .font-regular",
        ) as NodeListOf<HTMLElement>;

        const positions: number[] = [];
        const types: string[] = [];
        const navTop = navRef.current.getBoundingClientRect().top;

        allNavElements.forEach((el) => {
          const elTop = el.getBoundingClientRect().top;
          const relativeTop = elTop - navTop;
          positions.push(relativeTop);

          // Track if it's a title or subtitle
          const isTitle = el.classList.contains("font-medium");
          types.push(isTitle ? "title" : "subtitle");
        });

        setElementPositions(positions);
        setElementTypes(types);

        // Measure subtitle wrapper heights
        const titleWrappers = navRef.current.querySelectorAll(
          ".title-wrapper",
        ) as NodeListOf<HTMLElement>;
        const heights: number[] = [];
        const titleHeightsList: number[] = [];

        titleWrappers.forEach((wrapper) => {
          const titleElement = wrapper.querySelector(
            ".font-medium",
          ) as HTMLElement;

          // Get the title's natural height
          if (titleElement) {
            titleHeightsList.push(titleElement.offsetHeight);
          } else {
            titleHeightsList.push(0);
          }

          const subtitleWrapper = wrapper.querySelector(
            ".subtitle-wrapper",
          ) as HTMLElement;
          if (subtitleWrapper) {
            heights.push(subtitleWrapper.offsetHeight);
          } else {
            heights.push(0);
          }
        });

        setSubtitleHeights(heights);
        setTitleHeights(titleHeightsList);

        // Pre-calculate collapsed and expanded positions
        // Expanded: use actual DOM measurements (everything visible)
        const expanded = [...positions];

        // Collapsed: calculate positions if all subtitles were hidden
        const collapsed: number[] = [];
        const gapHeight = 12; // gap-3 = 0.75rem = 12px

        let cumulativeY = 0;
        let currentContentIndex = 0;
        let currentTitleIndex = -1;

        types.forEach((type, i) => {
          if (type === "title") {
            currentTitleIndex = i;
            collapsed.push(cumulativeY);
            cumulativeY +=
              (titleHeightsList[currentContentIndex] || 27) + gapHeight;
            currentContentIndex++;
          } else {
            // Subtitle: in collapsed state, use parent title's position
            const titlePos =
              currentTitleIndex >= 0 ? collapsed[currentTitleIndex] : 0;
            collapsed.push(titlePos);
          }
        });

        setCollapsedPositions(collapsed);
        setExpandedPositions(expanded);
        setExpandedPositions(expanded);
      }
    };

    updateHeightAndPositions();
    const resizeObserver = new ResizeObserver(updateHeightAndPositions);
    resizeObserver.observe(navRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [content]);

  useEffect(() => {
    // Force re-render after paths are created to get accurate lengths
    if (pathRefs.current.length > 0) {
      // Trigger a re-render by updating state
      setScrollProgress((prev) => prev + 0.0001);
    }
  }, [elementPositions, activeIndex]);

  useEffect(() => {
    const scrollContainer = scrollRootRef.current;

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      if (!navRef.current) return;

      // Get all nav elements (titles and subtitles)
      const allNavElements = navRef.current.querySelectorAll(
        ".font-medium, .font-regular",
      ) as NodeListOf<HTMLElement>;

      scrollRef.current = requestAnimationFrame(() => {
        // Create flat array of all content elements (titles + subtitles)
        const allContentElements: HTMLElement[] = [];
        content.forEach((item) => {
          allContentElements.push(item.title);
          item.subtitles.forEach((subtitle) => {
            allContentElements.push(subtitle);
          });
        });

        // Reset all to dimmed
        for (let i = 0; i < allContentElements.length; i++) {
          allNavElements[i].style.opacity = "0.5";
        }

        // Find the element currently in focus (closest to threshold from above)
        const containerBounds = scrollContainer.getBoundingClientRect();
        const threshold =
          containerBounds.top + scrollContainer.clientHeight / 2;
        let activeIndex = -1;
        let closestDistance = Infinity;

        allContentElements.forEach((element, i) => {
          const elementTop = element.getBoundingClientRect().y;
          const distance = threshold - elementTop;

          // Element is above threshold and closer than previous
          if (distance > 0 && distance < closestDistance) {
            closestDistance = distance;
            activeIndex = i;
          }
        });

        // Set only the active element to full opacity
        if (activeIndex !== -1) {
          allNavElements[activeIndex].style.opacity = "1";

          // If active element is a subtitle, also highlight its parent title
          if (allNavElements[activeIndex]?.classList.contains("font-regular")) {
            // Find parent title in DOM
            let parentFound = false;
            for (let i = activeIndex - 1; i >= 0; i--) {
              if (allNavElements[i]?.classList.contains("font-medium")) {
                allNavElements[i].style.opacity = "1";
                parentFound = true;
                break;
              }
            }
          }

          // Calculate scroll progress for line drawing
          // Progress should be based on how far past the threshold the current element is
          // When element just reaches threshold: progress = 0 (line hidden)
          // When next element reaches threshold: progress = 1 (line fully drawn)
          const currentElement = allContentElements[activeIndex];
          const nextElement = allContentElements[activeIndex + 1];

          if (currentElement && nextElement) {
            const currentTop = currentElement.getBoundingClientRect().y;
            const nextTop = nextElement.getBoundingClientRect().y;

            // Distance between current and next element
            const totalDistance = nextTop - currentTop;
            // How far current element is above threshold
            const distanceAboveThreshold = threshold - currentTop;
            // Progress is how much of the distance we've covered
            const progress = Math.max(
              0,
              Math.min(1, distanceAboveThreshold / totalDistance),
            );

            setScrollProgressInElement(progress);
          } else if (currentElement && !nextElement) {
            // Last element - just set to full
            setScrollProgressInElement(1);
          } else {
            setScrollProgressInElement(0);
          }
        } else {
          setScrollProgressInElement(0);
        }

        setActiveIndex(activeIndex);

        scrollRef.current = null;
      });
    };
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollRef.current !== null) {
        cancelAnimationFrame(scrollRef.current);
      }
    };
  }, [content, scrollRootRef]);
  // Helper function to find parent title index for a subtitle
  const getParentTitleIndex = (subtitleIndex: number): number => {
    for (let i = subtitleIndex - 1; i >= 0; i--) {
      if (elementTypes[i] === "title") {
        return i;
      }
    }
    return -1;
  };

  // Helper function to check if a title is active (title itself or any of its subtitles)
  const isTitleActive = (titleIndex: number): boolean => {
    if (titleIndex === activeIndex) return true;

    // Check if any subtitle under this title is active
    const activeParentIndex =
      elementTypes[activeIndex] === "subtitle"
        ? getParentTitleIndex(activeIndex)
        : -1;

    return activeParentIndex === titleIndex;
  };

  // Helper function to get title index in element array from content index
  const getTitleIndexFromContentIndex = (contentIndex: number): number => {
    let elementIndex = 0;
    for (let i = 0; i < contentIndex; i++) {
      elementIndex++; // Add 1 for the title
      elementIndex += content[i].subtitles.length; // Add subtitles count
    }
    return elementIndex;
  };

  // Calculate adjusted positions for subtitles based on active state
  const getAdjustedPositions = (): number[] => {
    if (collapsedPositions.length === 0 || expandedPositions.length === 0) {
      return elementPositions;
    }

    const adjusted: number[] = [];
    const gapHeight = 12;
    let cumulativeY = 0;
    let currentTitleIndex = -1;
    let currentContentIndex = 0;
    let hasSubtitles = false;

    elementTypes.forEach((type, i) => {
      hasSubtitles = content[currentContentIndex]?.subtitles.length > 0;
      if (type === "title") {
        currentTitleIndex = i;
        adjusted.push(cumulativeY);

        const isActive = isTitleActive(i);
        if (isActive) {
          // Active title: calculate space including its subtitles
          // Add title height
          cumulativeY +=
            (titleHeights[currentContentIndex] || 27) +
            gapHeight +
            (hasSubtitles ? 13.5 : 0);

          // Add space for subtitles if any
          if (subtitleHeights[currentContentIndex]) {
            cumulativeY += subtitleHeights[currentContentIndex];
          }
        } else {
          // Inactive title: only add title height
          cumulativeY += (titleHeights[currentContentIndex] || 27) + gapHeight;
        }

        currentContentIndex++;
      } else {
        // Subtitle
        const isParentActive = isTitleActive(currentTitleIndex);
        if (isParentActive) {
          // Active: use relative offset from expanded positions
          const relativeOffset =
            expandedPositions[i] - expandedPositions[currentTitleIndex];
          adjusted.push(adjusted[currentTitleIndex] + relativeOffset);
        } else {
          // Collapsed: use parent title position
          adjusted.push(adjusted[currentTitleIndex]);
        }
      }
    });

    return adjusted;
  };

  // Calculate stroke dashoffset for drawing effect based on scroll progress
  const getStrokeDashoffset = (
    pathIndex: number,
    pathLength: number | undefined,
  ): number => {
    // If path length not yet measured, hide by default with large value
    if (!pathLength || pathLength === 0) return 10000;

    // This path connects element[pathIndex] to element[pathIndex + 1]
    // It should draw when we're at element[pathIndex]

    // If we're currently at this element, draw based on scroll progress
    if (pathIndex === activeIndex) {
      return pathLength * (1 - scrollProgressInElement);
    }

    // If we've scrolled past this element, show the entire path
    if (pathIndex < activeIndex) {
      return 0;
    }

    // If we haven't reached this element yet, hide the entire path
    return pathLength;
  };

  // Smooth scroll to element
  const scrollToElement = (element: HTMLElement) => {
    const scrollContainer = scrollRootRef.current;

    if (!scrollContainer) {
      return;
    }

    const containerBounds = scrollContainer.getBoundingClientRect();
    const offset = scrollContainer.clientHeight / 2 - 50; // Center element with slight offset
    const elementPosition =
      element.getBoundingClientRect().top -
      containerBounds.top +
      scrollContainer.scrollTop;
    const offsetPosition = elementPosition - offset;

    scrollContainer.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <nav className="sticky left-0 top-0 w-full p-2 z-100 pointer-events-none flex flex-col gap-4 transition-opacity duration-300">
      <div className="group relative h-12 bg-black rounded-lg flex items-center justify-center pointer-events-auto text-white">
        <svg
          fill="#fff"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="32px"
          height="32px"
          viewBox="0 0 98.05 98.05"
        >
          <g>
            <path
              d="M98.023,17.465l-19.584-0.056c-0.004,0.711-0.006,1.563-0.017,2.121c1.664,0.039,5.922,0.822,7.257,4.327L66.92,67.155
		c-0.919-2.149-9.643-21.528-10.639-24.02l9.072-18.818c1.873-2.863,5.455-4.709,8.918-4.843l-0.01-1.968L55.42,17.489
		c-0.045,0.499,0.001,1.548-0.068,2.069c5.315,0.144,7.215,1.334,5.941,4.508c-2.102,4.776-6.51,13.824-7.372,15.475
		c-2.696-5.635-4.41-9.972-7.345-16.064c-1.266-2.823,1.529-3.922,4.485-4.004v-1.981l-21.82-0.067
		c0.016,0.93-0.021,1.451-0.021,2.131c3.041,0.046,6.988,0.371,8.562,3.019c2.087,4.063,9.044,20.194,11.149,24.514
		c-2.685,5.153-9.207,17.341-11.544,21.913c-3.348-7.43-15.732-36.689-19.232-44.241c-1.304-3.218,3.732-5.077,6.646-5.213
		l0.019-2.148L0,17.398c0.005,0.646,0.027,1.71,0.029,2.187c4.025-0.037,9.908,6.573,11.588,10.683
		c7.244,16.811,14.719,33.524,21.928,50.349c0.002,0.029,2.256,0.059,2.281,0.008c4.717-9.653,10.229-19.797,15.206-29.56
		L63.588,80.64c0.005,0.004,2.082,0.016,2.093,0.007c7.962-18.196,19.892-46.118,23.794-54.933c1.588-3.767,4.245-6.064,8.543-6.194
		l0.032-1.956L98.023,17.465z"
            />
          </g>
        </svg>
      </div>
      <div className="relative ml-2 h-0">
        <svg
          className="absolute left-4 top-6 origin-top-left transition-opacity duration-300"
          style={{ opacity: isVisible ? 1 : 0 }}
          width="18"
          height={navHeight}
          viewBox={`0 -2 18 ${navHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // preserveAspectRatio="none"
        >
          {elementPositions.map((originalY, i) => {
            const adjustedPositions = getAdjustedPositions();
            const y = adjustedPositions[i];
            const nextY = adjustedPositions[i + 1];
            const currentType = elementTypes[i];
            const nextType = elementTypes[i + 1];

            let pathD = "";

            if (i < elementPositions.length - 1 && nextY !== undefined) {
              const cornerRadius = 8;
              const midY = (y + nextY) / 2;

              if (currentType === "title" && nextType === "subtitle") {
                // Title to Subtitle: check if this title is active
                const isActive = isTitleActive(i);

                if (isActive) {
                  // Active: jut outward to x=17 with curves
                  const y2 = y + 19.5;
                  pathD = `M 1 ${y} 
                         L 1 ${y2 - cornerRadius} 
                         Q 1 ${y2}, ${1 + cornerRadius} ${y2}
                         L ${17 - cornerRadius} ${y2}
                         Q 17 ${y2}, 17 ${y2 + cornerRadius}
                         L 17 ${nextY}`;
                } else {
                  // Inactive: collapsed - no height, maintain same path structure
                  pathD = `M 1 ${y} 
                         L 1 ${y} 
                         Q 1 ${y}, 1 ${y}
                         L 1 ${y}
                         Q 1 ${y}, 1 ${y}
                         L 1 ${nextY}`;
                }
              } else if (currentType === "subtitle" && nextType === "title") {
                // Subtitle to Title: check if current subtitle's parent is active
                const parentTitleIndex = getParentTitleIndex(i);
                const isParentActive = isTitleActive(parentTitleIndex);

                if (isParentActive) {
                  // Parent active: come from x=17 with curves
                  const y2 = nextY - 19.5;
                  pathD = `M 17 ${y} 
                         L 17 ${y2 - cornerRadius} 
                         Q 17 ${y2}, ${17 - cornerRadius} ${y2}
                         L ${1 + cornerRadius} ${y2}
                         Q 1 ${y2}, 1 ${y2 + cornerRadius}
                         L 1 ${nextY}`;
                } else {
                  // Parent inactive: collapsed - no height, maintain same path structure
                  pathD = `M 1 ${y} 
                         L 1 ${nextY} 
                         Q 1 ${nextY}, 1 ${nextY}
                         L 1 ${nextY}
                         Q 1 ${nextY}, 1 ${nextY}
                         L 1 ${nextY}`;
                }
              } else if (
                currentType === "subtitle" &&
                nextType === "subtitle"
              ) {
                // Subtitle to Subtitle: check if parent title is active
                const parentTitleIndex = getParentTitleIndex(i);
                const isParentActive = isTitleActive(parentTitleIndex);

                if (isParentActive) {
                  pathD = `M 17 ${y} L 17 ${nextY}`;
                } else {
                  pathD = `M 1 ${y} L 1 ${nextY}`;
                }
              } else {
                // Title to Title: regular line
                pathD = `M 1 ${y} L 1 ${nextY}`;
              }
            }

            return (
              <g key={i}>
                {pathD && (
                  <g>
                    <path
                      d={pathD}
                      stroke="#161A27"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.1"
                      fill="none"
                      style={{
                        transition: "d 0.3s ease-in-out",
                      }}
                    />
                    <path
                      ref={(el) => {
                        pathRefs.current[i] = el;
                      }}
                      d={pathD}
                      stroke="#161A27"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={
                        i === activeIndex ? 1 : i < activeIndex ? 0.2 : 1
                      }
                      fill="none"
                      strokeDasharray={pathRefs.current[i]?.getTotalLength()}
                      strokeDashoffset={getStrokeDashoffset(
                        i,
                        pathRefs.current[i]?.getTotalLength(),
                      )}
                      style={{
                        transition: "d 0.3s ease-in-out",
                      }}
                    />
                  </g>
                )}
                <circle
                  cx={
                    currentType === "subtitle"
                      ? isTitleActive(getParentTitleIndex(i))
                        ? "17"
                        : "1"
                      : "1"
                  }
                  cy={y}
                  r="1"
                  fill="#161A27"
                  opacity="1"
                  style={{
                    transition: "cx 0.3s ease-in-out, cy 0.3s ease-in-out",
                  }}
                />
              </g>
            );
          })}
        </svg>
        <div
          className="relative flex flex-col gap-3 px-8 py-4 transition-opacity duration-300"
          style={{ opacity: isVisible ? 1 : 0 }}
          ref={navRef}
        >
          {/* <div className="absolute left-[250px] w-px h-full bg-black/10"></div> */}
          {content.map((item, i) => {
            const titleElementIndex = getTitleIndexFromContentIndex(i);
            const isActive = isTitleActive(titleElementIndex);
            const subtitleHeight = subtitleHeights[i] || 0;
            const titleHeight = titleHeights[i] || 27; // fallback to approximate height
            const gapHeight = 12; // gap-3 = 0.75rem = 12px

            return (
              <div
                className="relative title-wrapper flex flex-col gap-3 w-full max-w-[150px] h-auto opacity-100 pointer-events-auto overflow-hidden"
                key={i}
                style={{
                  height:
                    isActive && subtitleHeight > 0
                      ? `${titleHeight + gapHeight + subtitleHeight}px`
                      : `${titleHeight}px`,
                  transition: "height 0.3s ease-in-out",
                }}
              >
                <p
                  className="font-medium opacity-50 cursor-pointer hover:opacity-100! transition-opacity"
                  onClick={() => scrollToElement(item.title)}
                >
                  {item.title.dataset?.short || item.title.innerHTML}
                </p>
                {item.subtitles.length > 0 ? (
                  <div className="absolute subtitle-wrapper flex flex-col gap-3 pl-4 top-[calc(1em+1.25rem)]">
                    {Array.from(item.subtitles).map((subtitle, n) => (
                      <p
                        className="font-regular opacity-50 h-auto cursor-pointer hover:opacity-100! transition-opacity"
                        key={n}
                        onClick={() => scrollToElement(subtitle)}
                      >
                        {subtitle.dataset?.short || subtitle.innerHTML}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
