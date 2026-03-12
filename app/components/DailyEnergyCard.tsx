"use client";

import { useEffect, useState } from "react";

type DailyEnergyData = {
  ok: boolean;
  source: string;
  date: string;
  pillar: {
    tr: string;
    en: string;
  };
  stem: {
    name: string;
    element: string;
    yinYang: string;
  };
  branch: {
    name: string;
    animal: string;
  };
  badge: string;
  summary: string;
  focus: string;
  care: string;
};

export default function DailyEnergyCard() {
  const [data, setData] = useState<DailyEnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "https://ceren-feng-shui-lab.vercel.app/api/daily-energy",
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("API response failed");
        }

        const json = await res.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        console.error("DailyEnergyCard error:", err);
        if (!cancelled) {
          setError("Günün enerjisi şu anda yüklenemedi.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-neutral-900">
            Günün Enerjisi
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Çin astrolojisine göre günlük akış
          </p>
        </div>

        {data?.badge ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-700">
            {data.badge}
          </span>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Yükleniyor...</p>
      ) : error ? (
        <p className="text-sm text-neutral-500">{error}</p>
      ) : data ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">{data.date}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
                {data.pillar.tr}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600 shadow-sm">
                {data.stem.yinYang} {data.stem.element}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600 shadow-sm">
                {data.branch.animal}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm leading-6 text-neutral-700">
            <p>{data.summary}</p>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Destekleyen alan
              </p>
              <p>{data.focus}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Dikkat
              </p>
              <p>{data.care}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          Günlük enerji verisi bulunamadı.
        </p>
      )}
    </section>
  );
}