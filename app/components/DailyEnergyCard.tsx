"use client";

import { useEffect, useState } from "react";

type DayPart = {
  stem: string;
  branch: string;
  animal: string;
  label: string;
};

type DailyStatus = {
  key: string;
  emoji: string;
  text: string;
};

type DailyEnergyData = {
  ok: boolean;
  date: string;
  fullDateTR?: string;
  weekdayTR?: string;
  day: DayPart;
  month: DayPart;
  year: DayPart;
  statuses: DailyStatus[];
};

function getStemColor(char: string) {
  if (["甲", "乙"].includes(char)) return "text-emerald-600";
  if (["丙", "丁"].includes(char)) return "text-rose-600";
  if (["戊", "己"].includes(char)) return "text-amber-800";
  if (["庚", "辛"].includes(char)) return "text-slate-500";
  if (["壬", "癸"].includes(char)) return "text-sky-600";
  return "text-stone-700";
}

function getBranchColor(char: string) {
  if (["子", "亥"].includes(char)) return "text-sky-600";
  if (["丑", "辰", "未", "戌"].includes(char)) return "text-amber-800";
  if (["寅", "卯"].includes(char)) return "text-emerald-600";
  if (["巳", "午"].includes(char)) return "text-rose-600";
  if (["申", "酉"].includes(char)) return "text-slate-500";
  return "text-stone-700";
}

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

  const titleDate =
    data.fullDateTR ||
    new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(data.date));

  const subtitleDate = data.weekdayTR ?? "";

  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
            Günün Enerjisi
          </div>

          <div className="mt-2 text-lg font-semibold text-neutral-900">
            {titleDate}
          </div>

          {subtitleDate ? (
            <div className="mt-1 text-sm text-neutral-500">{subtitleDate}</div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1">
          {data.statuses?.map((item) => (
            <span
              key={item.key}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm"
              title={item.text}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 text-center">
        <div className="border-r border-neutral-200 px-2">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-neutral-400">
            GÜN
          </div>
          <div
            className={`text-[28px] font-medium ${getStemColor(data.day.stem)}`}
          >
            {data.day.stem}
          </div>
          <div
            className={`mt-1 text-[28px] font-normal ${getBranchColor(
              data.day.branch
            )}`}
          >
            {data.day.branch}
          </div>
          <div className="mt-1 text-xs text-neutral-600">{data.day.animal}</div>
        </div>

        <div className="border-r border-neutral-200 px-2">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-neutral-400">
            AY
          </div>
          <div
            className={`text-[28px] font-medium ${getStemColor(
              data.month.stem
            )}`}
          >
            {data.month.stem}
          </div>
          <div
            className={`mt-1 text-[28px] font-normal ${getBranchColor(
              data.month.branch
            )}`}
          >
            {data.month.branch}
          </div>
          <div className="mt-1 text-xs text-neutral-600">
            {data.month.animal}
          </div>
        </div>

        <div className="px-2">
          <div className="mb-2 text-[11px] font-medium tracking-wide text-neutral-400">
            YIL
          </div>
          <div
            className={`text-[28px] font-medium ${getStemColor(data.year.stem)}`}
          >
            {data.year.stem}
          </div>
          <div
            className={`mt-1 text-[28px] font-normal ${getBranchColor(
              data.year.branch
            )}`}
          >
            {data.year.branch}
          </div>
          <div className="mt-1 text-xs text-neutral-600">
            {data.year.animal}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {data.statuses?.length > 0 ? (
          data.statuses.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
            >
              {item.emoji} {item.text}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
            Bugün için belirgin bir enerji notu görünmüyor.
          </div>
        )}
      </div>
    </section>
  );
}