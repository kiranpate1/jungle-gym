"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { items } from "./items";
import Tag from "./components/Tag";
import PillLoaderComponent from "./pill-loader/PillLoaderComponent";

export const pendingCardReleaseKey = "jungle-gym:pending-card-release";

const revealedPreviewAssets = new Set<string>();
const loadedPreviewAssets = new Set<string>();
let cachedScrolledPastThreshold = false;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PreviewMedia({
  item,
  isReleasing,
}: {
  item: (typeof items)[number];
  isReleasing: boolean;
}) {
  const previewKey = item.preview ?? item.path ?? item.name;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(() =>
    revealedPreviewAssets.has(previewKey),
  );
  const [isImageLoaded, setIsImageLoaded] = useState(() =>
    loadedPreviewAssets.has(previewKey),
  );
  const [isVideoReady, setIsVideoReady] = useState(false);

  const markImageLoaded = () => {
    loadedPreviewAssets.add(previewKey);
    setIsImageLoaded(true);
  };

  const markVideoReady = () => {
    setIsVideoReady(true);
  };

  useEffect(() => {
    if (item.type !== "Video") {
      return;
    }

    const previewNode = containerRef.current;
    const cardNode = previewNode?.parentElement;

    if (!cardNode) {
      return;
    }

    const handleMouseEnter = () => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      void video.play().catch(() => {
        // Ignore transient autoplay/playback interruptions.
      });
    };

    const handleMouseLeave = () => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.pause();
      if (video.readyState > 0) {
        setTimeout(() => {
          video.currentTime = 0;
        }, 200);
      }
    };

    cardNode.addEventListener("mouseenter", handleMouseEnter);
    cardNode.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardNode.removeEventListener("mouseenter", handleMouseEnter);
      cardNode.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [item.type]);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const node = containerRef.current;

    if (!node) {
      return;
    }

    if (typeof window === "undefined" || !window.IntersectionObserver) {
      revealedPreviewAssets.add(previewKey);
      setIsVisible(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealedPreviewAssets.add(previewKey);
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, previewKey]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 -z-1 scale-100 group-hover:scale-105 transition-transform duration-300 ease-out translate-z-0",
        isReleasing && "scale-105",
      )}
      style={{
        backgroundColor: item.color ?? "transparent",
      }}
    >
      {isVisible ? (
        <>
          <Image
            src={item.preview}
            alt={item.name}
            width={500}
            height={500}
            loading="lazy"
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-500",
              isImageLoaded ? "opacity-100" : "opacity-0",
            )}
            style={{
              objectFit:
                (item.type === "Video" && item.name !== "Diagonal Carousel") ||
                item.name === "Dynamic Contents" ||
                item.name === "Album surfer" ||
                item.name === "Stack / Grid toggle" ||
                item.name === "Light/Dark Scroll" ||
                item.name === "Temperature control" ||
                item.name === "Sound control" ||
                item.name === "Album selector"
                  ? "contain"
                  : "cover",
            }}
            onLoad={markImageLoaded}
          />
          {item.type === "Video" ? (
            <video
              ref={videoRef}
              src={item.video}
              loop
              muted
              playsInline
              preload="metadata"
              className={cn(
                "absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isVideoReady ? "block" : "hidden",
              )}
              style={{
                objectFit:
                  item.name === "Diagonal Carousel" ? "cover" : "contain",
              }}
              onLoadedMetadata={markVideoReady}
              onLoadedData={markVideoReady}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default function Home({
  initialReleasePath = null,
}: {
  initialReleasePath?: string | null;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(
    cachedScrolledPastThreshold,
  );
  const [releasingCardPath, setReleasingCardPath] = useState<string | null>(
    initialReleasePath,
  );

  useEffect(() => {
    let rafId: number | undefined;

    const handleScroll = () => {
      if (rafId !== undefined) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        cachedScrolledPastThreshold = window.scrollY > 100;
        setScrolledPastThreshold(cachedScrolledPastThreshold);
        rafId = undefined;
      });
    };

    cachedScrolledPastThreshold = window.scrollY > 100;
    setScrolledPastThreshold(cachedScrolledPastThreshold);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const getItemCategories = (item: (typeof items)[number]) => {
    if ("categories" in item && Array.isArray(item.categories)) {
      return item.categories;
    }

    if ("categories" in item && Array.isArray(item.categories)) {
      return item.categories;
    }

    return [] as string[];
  };

  const allCategories = useMemo(
    () => Array.from(new Set(items.flatMap((item) => getItemCategories(item)))),
    [],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    return items.filter((item) => {
      const itemCategories = getItemCategories(item);
      const matchesCategoryFilter =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          itemCategories.includes(category),
        );

      if (!matchesCategoryFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableWords = [
        item.series,
        item.name,
        item.type,
        ...itemCategories,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

      return queryTerms.every((term) =>
        searchableWords.some((word) => word.startsWith(term)),
      );
    });
  }, [searchQuery, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((activeCategory) => activeCategory !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  useLayoutEffect(() => {
    if (!initialReleasePath) {
      return;
    }

    let frameTwo = 0;
    const frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        setReleasingCardPath(null);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
    };
  }, [initialReleasePath]);

  return (
    <main>
      <section className="flex flex-col items-center">
        <div className="relative w-full flex flex-col items-center gap-12 px-4 py-8">
          <div className="absolute z-11 w-[calc(100dvw-32px)] max-w-[1000px] h-0">
            <div className="absolute top-0 right-0 flex items-center gap-2 text-[rgba(255,255,255,0.4)] duration-200">
              <small className="caption">
                by{" "}
                <a
                  className="hover:underline hover:text-[rgba(255,255,255,0.6)]"
                  href="https://www.kiranpa.tel/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kiran patel
                </a>
              </small>
              <a
                className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.5)] duration-200"
                href="mailto:kp8568@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM19 6L12.5 10.47C12.348 10.5578 12.1755 10.604 12 10.604C11.8245 10.604 11.652 10.5578 11.5 10.47L5 6H19Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.5)] duration-200"
                href="https://www.x.com/pate1kiran"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28004 9.09 5.11004 7.38 3.00004 4.79C2.63004 5.42 2.42004 6.16 2.42004 6.94C2.42004 8.43 3.17004 9.75 4.33004 10.5C3.62004 10.5 2.96004 10.3 2.38004 10V10.03C2.38004 12.11 3.86004 13.85 5.82004 14.24C5.19088 14.4129 4.53008 14.4369 3.89004 14.31C4.16165 15.1625 4.69358 15.9084 5.41106 16.4429C6.12854 16.9775 6.99549 17.2737 7.89004 17.29C6.37371 18.4905 4.49405 19.1394 2.56004 19.13C2.22004 19.13 1.88004 19.11 1.54004 19.07C3.44004 20.29 5.70004 21 8.12004 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="fixed z-10 inset-[16px_16px_auto_16px] flex flex-col items-center">
            <div
              className={cn(
                "relative w-full max-w-[1000px] flex items-start justify-between duration-200 ease-in-out",
                scrolledPastThreshold && "max-w-full",
              )}
            >
              <div
                className={cn(
                  "absolute inset-[-12px_-12px_auto_-12px] h-12.75 opacity-0 bg-[#111111] border-[1.5px] border-white/5 rounded-[20px] squircle pointer-events-none duration-200",
                  scrolledPastThreshold && "opacity-100! xl:opacity-0!",
                )}
              ></div>
              <div className="relative w-full flex flex-col gap-8 items-start">
                <h1
                  className={cn(
                    "origin-top-left duration-200 ease-in-out whitespace-nowrap",
                    scrolledPastThreshold && "scale-50",
                  )}
                >
                  Jungle Gym
                </h1>
                <div
                  className={cn(
                    "w-full flex items-stretch gap-2 flex-wrap origin-top-left transition-transform duration-200 ease-in-out",
                    scrolledPastThreshold &&
                      "xl:w-[calc(50vw-470px)] scale-[0.8] translate-x-32 xl:translate-x-0 -translate-y-21 xl:-translate-y-12",
                  )}
                >
                  {allCategories.map((category) => (
                    <Tag
                      key={category}
                      type={category}
                      active={selectedCategories.includes(category)}
                      onClick={() => toggleCategory(category)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    aria-label="Clear category filters"
                    className="min-w-8 aspect-square flex items-center justify-center border-[1.5px] border-white/5 bg-transparent hover:bg-white/5 rounded-2xl squircle text-white/40 hover:text-white duration-300 cursor-pointer"
                  >
                    <svg
                      width="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12L18 18M12 12L6 6M12 12L6 18M12 12L18 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                className={cn(
                  "absolute right-0 w-40 h-[32.2px] origin-top-right top-[calc(100%-2rem)] duration-200 ease-in-out",
                  scrolledPastThreshold && "top-0! scale-[0.8]",
                )}
              >
                <input
                  className="w-full h-full flex items-center px-2 bg-transparent border-[1.5px] border-white/5 hover:border-white/10 rounded-2xl squircle text-sm text-white/60 focus:bg-white/2.5 focus:border-white/10 focus:outline-none transition-all duration-200"
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-[1000px] mt-32 grid grid-cols-1 lg:grid-cols-2 gap-2">
            {filteredItems.map((item) => {
              const isReleasing = Boolean(
                item.path && releasingCardPath === item.path,
              );

              return (
                <div
                  className="group relative shadow-[inset_0_0_0_2px_rgba(255,255,255,0.025)] aspect-4/3 rounded-3xl squircle overflow-hidden transition-all duration-200"
                  key={item.name}
                >
                  {item.preview && (
                    <PreviewMedia item={item} isReleasing={isReleasing} />
                  )}
                  {item.isNew && (
                    <div className="absolute top-4 right-4 px-2.25 py-2.75 bg-[rgba(62,62,62,0.6)] rounded-2xl squircle">
                      <small className="text-white/80">New</small>
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute left-4 group-hover:left-1 bottom-4 group-hover:bottom-1 w-10 group-hover:w-[calc(100%-8px)] h-10 group-hover:h-16 bg-[#1b1b1b] group-hover:bg-[#111111] border-[1.5px] border-white/5 rounded-[20px] group-hover:rounded-xl overflow-hidden duration-200 ease-in-out",
                      isReleasing &&
                        "left-[4px] bottom-[4px] w-[calc(100%-8px)] h-16 bg-[#111111] rounded-xl",
                    )}
                  ></div>
                  <div className="absolute inset-[auto_26px_26px_26px] flex items-center gap-2">
                    <div className="w-5 h-5 text-white/60">
                      {item.type === "Video" ? (
                        <svg
                          width="100%"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 8C3 6.11438 3 5.17157 3.58579 4.58579C4.17157 4 5.11438 4 7 4H17C18.8856 4 19.8284 4 20.4142 4.58579C21 5.17157 21 6.11438 21 8V16C21 17.8856 21 18.8284 20.4142 19.4142C19.8284 20 18.8856 20 17 20H7C5.11438 20 4.17157 20 3.58579 19.4142C3 18.8284 3 17.8856 3 16V8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M13.0311 10.1381C14.4645 10.9656 15.1812 11.3794 15.1812 12.0001C15.1812 12.6207 14.4645 13.0345 13.0311 13.862L12.225 14.3275C10.7917 15.155 10.075 15.5687 9.53749 15.2584C9 14.9481 9 14.1205 9 12.4655V11.5346C9 9.8796 9 9.05207 9.53749 8.74174C10.075 8.43142 10.7917 8.84517 12.225 9.67268L13.0311 10.1381Z"
                            stroke="currentColor"
                            strokeWidth="1.6125"
                          />
                        </svg>
                      ) : item.type === "Product" ? (
                        <svg
                          width="100%"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 10V16C3 17.8856 3 18.8284 3.58579 19.4142C4.17157 20 5.11438 20 7 20H17C18.8856 20 19.8284 20 20.4142 19.4142C21 18.8284 21 17.8856 21 16V10M3 10V8C3 6.11438 3 5.17157 3.58579 4.58579C4.17157 4 5.11438 4 7 4H17C18.8856 4 19.8284 4 20.4142 4.58579C21 5.17157 21 6.11438 21 8V10M3 10H21"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle cx="6" cy="7" r="1" fill="currentColor" />
                          <circle cx="9" cy="7" r="1" fill="currentColor" />
                        </svg>
                      ) : item.type === "Interaction" ? (
                        <svg
                          width="100%"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 19H7C5.11438 19 4.17157 19 3.58579 18.4142C3 17.8284 3 16.8856 3 15L3 9C3 7.11438 3 6.17157 3.58579 5.58579C4.17157 5 5.11438 5 7 5H17C18.8856 5 19.8284 5 20.4142 5.58579C21 6.17157 21 7.11438 21 9V13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14.9651 17.3476L17.349 23M11.8237 9.09838C11.7765 9.05114 11.7162 9.01906 11.6506 9.00624C11.585 8.99342 11.5171 9.00045 11.4555 9.02642C11.3939 9.05239 11.3415 9.09613 11.3049 9.15204C11.2683 9.20796 11.2492 9.27352 11.25 9.34034L11.25 21.0295C11.2504 21.1003 11.2687 21.1591 11.3103 21.2164C11.3519 21.2737 11.4105 21.3166 11.4777 21.3389C11.5449 21.3613 11.6174 21.362 11.6851 21.341C11.7527 21.3199 11.8121 21.2783 11.8548 21.2218L14.3876 17.8107C14.5304 17.6095 14.7255 17.4512 14.9518 17.3529C15.1781 17.2546 15.427 17.2201 15.6715 17.2531L19.9103 17.8242C19.9808 17.8336 20.0524 17.8206 20.1149 17.7869C20.1775 17.7533 20.2279 17.7008 20.259 17.6369C20.2901 17.5731 20.3003 17.501 20.2881 17.431C20.2759 17.361 20.2419 17.2966 20.1911 17.247L11.8237 9.09838Z"
                            stroke="currentColor"
                            strokeWidth="1.3526"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </div>
                    <div
                      className={cn(
                        "flex-1 flex items-center justify-between gap-2 mask-[linear-gradient(to_right,white_33%,transparent_67%)] mask-no-repeat mask-size-[300%_100%] group-hover:mask-position-[0px_0]! duration-300 ease-in-out",
                        isReleasing && "mask-position-[0px_0]!",
                      )}
                      style={{
                        maskPosition: "100% 0",
                      }}
                    >
                      <h3 className="whitespace-nowrap">
                        {item.series && (
                          <span className="text-white/60">
                            {item.series} /{" "}
                          </span>
                        )}
                        <span className="text-white/90">{item.name}</span>
                      </h3>
                      {/* <p className="text-gray-600">{item.description}</p> */}
                      <small
                        className={cn(
                          "opacity-0 group-hover:opacity-50 duration-200 delay-100",
                          isReleasing && "opacity-50",
                        )}
                      >
                        {item.year}
                      </small>
                    </div>
                  </div>
                  {item.path && (
                    <Link
                      href={item.path}
                      scroll={false}
                      className="absolute inset-0"
                      onClick={() => {
                        window.sessionStorage.setItem(
                          pendingCardReleaseKey,
                          item.path!,
                        );
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
