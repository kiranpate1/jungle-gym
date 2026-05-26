"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { items } from "../items";

export default function ModalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const activeItem = items.find((item) => item.path === pathname);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.push("/");
    }, 400);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alignControlsRight, setAlignControlsRight] = useState(false);
  const WINDOW_TRANSITION_MS = 350;

  const toggleScreenSize = () => {
    const windowEl = windowRef.current;
    if (!windowEl) {
      return;
    }

    if (isFullscreen) {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }

    // if (!document.fullscreenElement) {
    //   windowEl.requestFullscreen().then(() => setIsFullscreen(true));
    // } else {
    //   document.exitFullscreen().then(() => setIsFullscreen(false));
    // }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAlignControlsRight(isFullscreen);
    }, WINDOW_TRANSITION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isFullscreen]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div
        style={{
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(20px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          width: isFullscreen ? "100dvw" : "min(100vw, 800px)",
          height: isFullscreen ? "100dvh" : "min(100vh, 650px)",
        }}
        className="relative"
        ref={windowRef}
      >
        <div className="relative w-full h-full flex flex-col items-stretch rounded-3xl squircle overflow-hidden bg-[#000] border-2 border-white/5">
          <div
            className="flex-1 relative w-full h-full rounded-xl squircle overflow-hidden"
            style={{ backgroundColor: activeItem?.color ?? "transparent" }}
          >
            {children}
          </div>
          <div className="w-full flex items-center gap-4 p-4">
            <h3 className="whitespace-nowrap">
              {activeItem?.series && (
                <span className="text-white/60">{activeItem.series} / </span>
              )}
              <span className="text-white/90">{activeItem?.name}</span>
            </h3>
            <div className="flex items-stretch gap-2">
              {activeItem?.categories.map((cat, i) => (
                <div
                  className="px-1.75 py-2.25 border-[1.5px] border-white/5 bg-white/2.5 text-white/60 rounded-2xl squircle whitespace-nowrap"
                  key={i}
                >
                  <small>{cat}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute z-1000 top-0 left-[calc(100%+8px)] max-w-8 flex flex-col items-start gap-2"
          style={{
            top: isFullscreen ? 8 : 0,
            left: isFullscreen ? "calc(100% - 40px)" : "calc(100% + 8px)",
            alignItems: alignControlsRight ? "flex-end" : "flex-start",
            transition: "top 0.35s ease, left 0.35s ease",
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="group w-8 hover:w-19.5 h-8 px-[8.5px] flex items-center justify-start gap-1.5 rounded-2xl hover:rounded-xl bg-[#080808] hover:bg-[#111111] border-[1.5px] border-white/5 text-white/50 hover:text-white transition-all duration-200 ease-in-out cursor-pointer overflow-hidden"
          >
            <svg
              className="min-w-3"
              width="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <small className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Close
            </small>
          </button>
          <button
            type="button"
            onClick={toggleScreenSize}
            aria-label="Fullscreen"
            className={`group w-8 ${isFullscreen ? "hover:w-24.5" : "hover:w-27"} h-8 px-[8.5px] flex items-center justify-start gap-1.5 rounded-2xl hover:rounded-xl bg-[#080808] hover:bg-[#111111] border-[1.5px] border-white/5 text-white/50 hover:text-white transition-all duration-200 ease-in-out cursor-pointer overflow-hidden`}
          >
            <svg
              className="min-w-3"
              width="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                style={{
                  transformOrigin: "75% 25%",
                  transformBox: "fill-box",
                  transform: isFullscreen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M12.3332 7.33341V3.66675H8.6665"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
              <g
                style={{
                  transformOrigin: "25% 75%",
                  transformBox: "fill-box",
                  transform: isFullscreen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M3.6665 8.66675V12.3334H7.33317"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>

            <small className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isFullscreen ? "Minimize" : "Fullscreen"}
            </small>
          </button>
        </div>
      </div>
    </div>
  );
}
