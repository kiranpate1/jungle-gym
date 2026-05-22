"use client";

import { useState } from "react";
import HomePage, { pendingCardReleaseKey } from "../page";
import ModalShell from "../components/ModalShell";
import CarSoundComponent from "./CarSoundComponent";

export default function CarSoundPage() {
  const [initialReleasePath] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const pendingPath = window.sessionStorage.getItem(pendingCardReleaseKey);
    window.sessionStorage.removeItem(pendingCardReleaseKey);
    return pendingPath === "/car-sound" ? pendingPath : null;
  });

  return (
    <>
      <HomePage initialReleasePath={initialReleasePath} />
      <ModalShell>
        <CarSoundComponent />
      </ModalShell>
    </>
  );
}
