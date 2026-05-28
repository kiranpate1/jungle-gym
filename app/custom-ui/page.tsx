"use client";

import { useState } from "react";
import HomePage, { pendingCardReleaseKey } from "../page";
import ModalShell from "../components/ModalShell";

export default function CustomUIPage() {
  const [initialReleasePath] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const pendingPath = window.sessionStorage.getItem(pendingCardReleaseKey);
    window.sessionStorage.removeItem(pendingCardReleaseKey);
    return pendingPath === "/custom-ui" ? pendingPath : null;
  });

  return (
    <>
      <HomePage initialReleasePath={initialReleasePath} />
      <ModalShell>
        <video
          src="/videos/custom-ui.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </ModalShell>
    </>
  );
}
