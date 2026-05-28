"use client";

import { useState } from "react";
import HomePage, { pendingCardReleaseKey } from "../page";
import ModalShell from "../components/ModalShell";
import AlbumSelectorComponent from "./AlbumSelectorComponent";

export default function AlbumSelectorPage() {
  const [initialReleasePath] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const pendingPath = window.sessionStorage.getItem(pendingCardReleaseKey);
    window.sessionStorage.removeItem(pendingCardReleaseKey);
    return pendingPath === "/album-selector" ? pendingPath : null;
  });

  return (
    <>
      <HomePage initialReleasePath={initialReleasePath} />
      <ModalShell>
        <AlbumSelectorComponent />
      </ModalShell>
    </>
  );
}
