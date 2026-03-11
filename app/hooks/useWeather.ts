"use client";

import { useEffect, useState, useCallback } from "react";

export type WeatherData = {
  location: string;
  tempC: number | null;
  windKmh: number | null;
  windDeg: number | null;
  pressure: number | null;
  isLodos: boolean;
  lodosLevel: "none" | "light" | "normal" | "strong";
  updatedAt: string;
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/weather", { cache: "no-store" });
      const data = await r.json();
      setWeather(data);
    } catch (e) {
      console.error("weather error", e);
    }
  }, []);

  useEffect(() => {
    refresh();

    const id = setInterval(refresh, 10 * 60 * 1000);

    return () => clearInterval(id);
  }, [refresh]);

  return { weather, refresh };
}