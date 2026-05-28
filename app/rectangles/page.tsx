"use client";

import { useState } from "react";
import HomePage, { pendingCardReleaseKey } from "../page";
import ModalShell from "../components/ModalShell";

export default function RectanglesPage() {
  const [initialReleasePath] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const pendingPath = window.sessionStorage.getItem(pendingCardReleaseKey);
    window.sessionStorage.removeItem(pendingCardReleaseKey);
    return pendingPath === "/rectangles" ? pendingPath : null;
  });

  return (
    <>
      <HomePage initialReleasePath={initialReleasePath} />
      <ModalShell>
        <video
          src="/videos/rectangles.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        />
      </ModalShell>
    </>
  );
}
