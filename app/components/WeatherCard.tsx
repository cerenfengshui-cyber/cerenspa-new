"use client";

import { useWeather } from "../hooks/useWeather";

export default function WeatherCard() {
  const { weather, refresh } = useWeather();

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">Hava</h2>
        <span className="text-xs text-neutral-500">Suadiye / Kadıköy</span>
      </div>

      {!weather ? (
        <p className="mt-4 text-sm text-neutral-500">Yükleniyor...</p>
      ) : (
        <div className="mt-4">
          <div className="text-4xl font-semibold">{weather.tempC}°</div>

          <p className="mt-1 text-sm text-neutral-700">
            {weather.isLodos ? "⚠️ Lodos var" : "Lodos yok"} • {weather.windKmh} km/sa • {weather.pressure} hPa
          </p>

          <button
            onClick={refresh}
            className="mt-3 rounded-2xl bg-white/35 px-3 py-1.5 text-xs ring-1 ring-black/5 hover:bg-white/55"
          >
            Yenile
          </button>

          {weather.updatedAt && (
            <span className="ml-3 text-xs text-neutral-500">
              güncellendi:{" "}
              {new Date(weather.updatedAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}