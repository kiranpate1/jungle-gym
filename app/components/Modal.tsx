"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  path: string | null;
  onClose: () => void;
};

export default function Modal({ path, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [mountedPath, setMountedPath] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // When a path is provided, mount the iframe then trigger the enter transition
  useEffect(() => {
    if (path) {
      setMountedPath(path);
      // Allow one frame for the element to mount before starting transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      // Start exit transition, then unmount iframe after it completes
      setVisible(false);
      const timer = setTimeout(() => setMountedPath(null), 400);
      return () => clearTimeout(timer);
    }
  }, [path]);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mountedPath) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        style={{
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.96) translateY(16px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
        }}
        className="relative w-[90vw] max-w-[500px] aspect-[500/450] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        <iframe
          src={mountedPath}
          className="w-full h-full border-0"
          title="Interaction preview"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white/60 hover:text-white backdrop-blur-sm transition-all duration-200"
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
