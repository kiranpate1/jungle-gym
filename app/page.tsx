"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { items } from "./items";
import Tag from "./components/Tag";

export const pendingCardReleaseKey = "jungle-gym:pending-card-release";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Home({
  initialReleasePath = null,
}: {
  initialReleasePath?: string | null;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [releasingCardPath, setReleasingCardPath] = useState<string | null>(
    initialReleasePath,
  );

  const getItemCategories = (item: (typeof items)[number]) => {
    if ("categories" in item && Array.isArray(item.categories)) {
      return item.categories;
    }

    if ("cetegories" in item && Array.isArray(item.cetegories)) {
      return item.cetegories;
    }

    return [] as string[];
  };

  const allCategories = useMemo(
    () => Array.from(new Set(items.flatMap((item) => getItemCategories(item)))),
    [],
  );

  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const itemCategories = getItemCategories(item);
      return selectedCategories.some((category) =>
        itemCategories.includes(category),
      );
    });
  }, [selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((activeCategory) => activeCategory !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
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
    <main className="">
      <section className="flex flex-col items-center">
        <div className="w-full max-w-[1000px] flex flex-col items-stretch gap-12 px-4 py-8">
          <h1>Jungle Gym</h1>
          <div className="w-full flex items-stretch justify-between">
            <div className="flex items-stretch gap-2">
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
                className="aspect-square flex items-center justify-center border-[1.5px] border-white/5 bg-transparent hover:bg-white/5 rounded-2xl squircle text-white/40 hover:text-white duration-300 cursor-pointer"
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
            <input
              className="w-40 flex items-center px-2 bg-transparent border-[1.5px] border-white/2.5 hover:border-white/5 rounded-2xl squircle text-sm text-white/60 focus:bg-white/2.5 focus:border-white/5 focus:outline-none transition-all duration-200"
              type="text"
              name="test"
              placeholder="Search..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filteredItems.map((item) => {
              const isReleasing = Boolean(
                item.path && releasingCardPath === item.path,
              );

              return (
                <div
                  className={cn(
                    "group relative bg-white/0.5 hover:bg-white/1 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.025)] aspect-4/3 rounded-3xl squircle overflow-hidden transition-all duration-200",
                    isReleasing && "bg-white/1",
                  )}
                  key={item.name}
                >
                  {item.asset && (
                    <>
                      <div
                        className={cn(
                          "absolute inset-0 -z-1 scale-100 group-hover:scale-105 transition-transform duration-300 ease-out",
                          isReleasing && "scale-105",
                        )}
                      >
                        {item.type === "Video" ? (
                          <video
                            src={item.asset}
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.asset}
                            alt={item.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </>
                  )}
                  {item.isNew && (
                    <div className="absolute top-4 left-4 px-2.25 pt-0.5 pb-1.25 bg-[#0e0e0e] rounded-2xl squircle">
                      <small className="opacity-35">New</small>
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
                        "flex-1 flex items-center justify-between gap-2 mask-[linear-gradient(to_right,white_33%,transparent_67%)] mask-no-repeat mask-size-[300%_100%] mask-position-[-800px_0] group-hover:mask-position-[0px_0] duration-300 ease-in-out",
                        isReleasing && "mask-position-[0px_0]",
                      )}
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
