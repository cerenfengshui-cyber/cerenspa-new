"use client";

import { useEffect, useState } from "react";

type DayPart = {
  stem: string;
  branch: string;
  animal: string;
  label: string;
};

type DailyEnergyData = {
  ok: boolean;
  date: string;
  day: DayPart;
  month: DayPart;
  year: DayPart;
  clash: boolean;
  clashText: string;
  harmony: boolean;
  harmonyText: string;
  penalty: boolean;
  penaltyText: string;
  badge: string;
};

export default function DailyEnergyCard() {
  const [data, setData] = useState<DailyEnergyData | null>(null);

  useEffect(() => {
    fetch("https://ceren-feng-shui-lab.vercel.app/api/daily-energy", {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <section className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm">
        <p className="text-sm text-neutral-500">Yükleniyor...</p>
      </section>
    );
  }

  const dayNumber = new Date(data.date).getDate();

  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-start justify-between">
        <div className="text-2xl font-semibold">{dayNumber}</div>

        {data.badge && (
          <span className="rounded-xl bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            {data.badge}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 text-center text-xs text-neutral-500">
        <div>GÜN</div>
        <div>AY</div>
        <div>YIL</div>
      </div>

      <div className="mt-1 grid grid-cols-3 text-center text-xl font-semibold">
        <div>{data.day.stem}</div>
        <div>{data.month.stem}</div>
        <div>{data.year.stem}</div>
      </div>

      <div className="mt-3 text-sm text-neutral-700">
        {data.day.label} – {data.month.label} – {data.year.label}
      </div>

      {data.clash && (
        <div className="mt-4 text-sm text-blue-700">
          ⚠ Çatışma
          <div className="text-neutral-700">{data.clashText}</div>
        </div>
      )}

      {data.harmony && (
        <div className="mt-2 text-sm text-green-700">
          △ Uyum
          <div className="text-neutral-700">{data.harmonyText}</div>
        </div>
      )}

      {data.penalty && (
        <div className="mt-2 text-sm text-red-700">
          ⚖ Penaltı
          <div className="text-neutral-700">{data.penaltyText}</div>
        </div>
      )}
    </section>
  );
}