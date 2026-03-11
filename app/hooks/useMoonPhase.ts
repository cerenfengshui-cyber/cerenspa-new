"use client";

import { useEffect, useState } from "react";

type MoonData = {
  phase: string;
  illumination: number;
  lunarDay: number;
};

function calculateMoonData(): MoonData {
  const now = new Date();

  // Ortalama sinodik ay süresi (saniye)
  const lunarPeriodSeconds = 2551443;

  // Referans yeni ay
  const referenceNewMoon = new Date("2000-01-06T18:14:00Z").getTime() / 1000;

  const nowSeconds = now.getTime() / 1000;
  const phaseProgress =
    ((nowSeconds - referenceNewMoon) % lunarPeriodSeconds) / lunarPeriodSeconds;

  const normalizedPhase = phaseProgress < 0 ? phaseProgress + 1 : phaseProgress;

  const illumination = Math.round(
    (1 - Math.cos(normalizedPhase * 2 * Math.PI)) * 50
  );

  const lunarDay = Math.min(30, Math.max(1, Math.floor(normalizedPhase * 29.53) + 1));

  let phase = "";

  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    phase = "Yeni Ay";
  } else if (normalizedPhase < 0.22) {
    phase = "Büyüyen Hilal";
  } else if (normalizedPhase < 0.28) {
    phase = "İlk Dördün";
  } else if (normalizedPhase < 0.47) {
    phase = "Büyüyen Ay";
  } else if (normalizedPhase < 0.53) {
    phase = "Dolunay";
  } else if (normalizedPhase < 0.72) {
    phase = "Küçülen Ay";
  } else if (normalizedPhase < 0.78) {
    phase = "Son Dördün";
  } else {
    phase = "Küçülen Hilal";
  }

  return {
    phase,
    illumination,
    lunarDay,
  };
}

export function useMoonPhase() {
  const [moon, setMoon] = useState<MoonData | null>(null);

  useEffect(() => {
    setMoon(calculateMoonData());
  }, []);

  return { moon };
}