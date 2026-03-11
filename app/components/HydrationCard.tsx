"use client";

import { useWeather } from "../hooks/useWeather";
import { useHydration } from "../hooks/useHydration";

export default function HydrationCard() {
  const { weather } = useWeather();
  const isLodos = weather?.isLodos ?? false;

  const {
    hydration,
    setHydration,
    goalMl,
    baseGoalMl,
    extraMl,
    lastWeekAmount,
  } = useHydration(isLodos);

  const addWater = (amount: number) => {
    setHydration((prev) => ({
      ...prev,
      drankMl: prev.drankMl + amount,
    }));
  };

  const removeWater = (amount: number) => {
    setHydration((prev) => ({
      ...prev,
      drankMl: Math.max(0, prev.drankMl - amount),
    }));
  };

  const resetWater = () => {
    setHydration((prev) => ({
      ...prev,
      drankMl: 0,
    }));
  };

  const progress =
    goalMl > 0
      ? Math.min(100, Math.round((hydration.drankMl / goalMl) * 100))
      : 0;

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">Su</h2>

        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500">{goalMl} ml hedef</span>

          <a
            href="/hydration"
            className="text-xs text-neutral-600 underline underline-offset-2"
          >
            Geçmiş →
          </a>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs text-neutral-500">Kilo</label>
        <input
          type="number"
          value={hydration.weightKg}
          onChange={(e) =>
            setHydration((prev) => ({
              ...prev,
              weightKg: Number(e.target.value) || 0,
            }))
          }
          className="w-24 rounded-xl border border-black/10 bg-white/50 px-3 py-2 text-sm outline-none"
        />
        <span className="ml-2 text-sm text-neutral-600">kg</span>
      </div>

      <div className="mt-4 text-4xl font-semibold">{hydration.drankMl} ml</div>

      <p className="mt-1 text-sm text-neutral-700">%{progress} tamamlandı</p>

      <p className="mt-2 text-xs text-neutral-500">
        Normal hedef: {baseGoalMl} ml
        {extraMl > 0 ? ` • Lodos ekstra: +${extraMl} ml` : ""}
      </p>

      {lastWeekAmount > 0 && (
        <p className="mt-2 text-xs text-neutral-500">
          Geçen hafta bugün: <b>{lastWeekAmount} ml</b>
        </p>
      )}

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-neutral-700 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => addWater(250)}
          className="rounded-2xl bg-white/35 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/55"
        >
          +250 ml
        </button>

        <button
          onClick={() => addWater(500)}
          className="rounded-2xl bg-white/35 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/55"
        >
          +500 ml
        </button>

        <button
          onClick={() => removeWater(250)}
          className="rounded-2xl bg-white/35 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/55"
        >
          -250
        </button>

        <button
          onClick={resetWater}
          className="rounded-2xl bg-red-100 px-3 py-1.5 text-sm ring-1 ring-red-200 hover:bg-red-200"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}