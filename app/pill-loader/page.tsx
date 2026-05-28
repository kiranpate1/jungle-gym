"use client";

import { useState } from "react";
import HomePage, { pendingCardReleaseKey } from "../page";
import ModalShell from "../components/ModalShell";
import PillLoaderComponent from "./PillLoaderComponent";

export default function PillLoaderPage() {
  const [initialReleasePath] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const pendingPath = window.sessionStorage.getItem(pendingCardReleaseKey);
    window.sessionStorage.removeItem(pendingCardReleaseKey);
    return pendingPath === "/pill-loader" ? pendingPath : null;
  });

  return (
    <>
      <HomePage initialReleasePath={initialReleasePath} />
      <ModalShell>
        <PillLoaderComponent />
      </ModalShell>
    </>
  );
}
