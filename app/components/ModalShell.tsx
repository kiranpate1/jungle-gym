"use client";

import { useEffect, useState } from "react";
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

  const activeItem = items.find((item) => item.path === pathname);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
        }}
        className="relative w-[90vw] max-w-[800px]"
      >
        <div className="relative w-full  rounded-3xl squircle overflow-hidden bg-[#000] border-2 border-white/5">
          <div className="relative w-full h-[80vh] max-h-[600px] rounded-xl squircle overflow-hidden">
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
                  className="px-1.75 py-2.25 border-[1.5px] border-white/5 bg-white/2.5 text-white/60 rounded-2xl squircle whitespace-nowrap duration-300 cursor-pointer"
                  key={i}
                >
                  <small>{cat}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="group absolute z-10 top-0 left-[calc(100%+8px)] w-8 hover:w-19.5 h-8 px-[8.5px] flex items-center justify-start gap-1.5 rounded-2xl hover:rounded-xl bg-[#080808] hover:bg-[#111111] border-[1.5px] border-white/5 text-white/40 hover:text-white transition-all duration-200 ease-in-out cursor-pointer overflow-hidden"
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
          aria-label="Fullscreen"
          className="group absolute z-10 top-10 left-[calc(100%+8px)] w-8 hover:w-27 h-8 px-[8.5px] flex items-center justify-start gap-1.5 rounded-2xl hover:rounded-xl bg-[#080808] hover:bg-[#111111] border-[1.5px] border-white/5 text-white/40 hover:text-white transition-all duration-200 ease-in-out cursor-pointer overflow-hidden"
        >
          <svg
            className="min-w-3"
            width="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.3332 7.33341V3.66675H8.6665M3.6665 8.66675V12.3334H7.33317"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <small className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Fullscreen
          </small>
        </button>
      </div>
    </div>
  );
}
