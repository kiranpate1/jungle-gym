"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ModalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

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
        className="relative w-[90vw] max-w-[800px] h-[80vh] max-h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {children}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white/60 hover:text-white backdrop-blur-sm transition-all duration-200 z-10"
        >
          <svg
            width="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
