"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HydrationHistory = Record<string, { drankMl: number }>;

const HISTORY_KEY = "cerenspa:hydration:history:v1";

function formatDateTr(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, (month ?? 1) - 1, day ?? 1);

  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}

function getDateKeyDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shortLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, (month ?? 1) - 1, day ?? 1);

  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function HydrationPage() {
  const [history, setHistory] = useState<HydrationHistory>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // sessiz geç
    }
  }, []);

  const entries = useMemo(() => {
    return Object.entries(history).sort((a, b) => b[0].localeCompare(a[0]));
  }, [history]);

  const last7Days = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const key = getDateKeyDaysAgo(i);
      const amount = history[key]?.drankMl ?? 0;

      days.push({
        key,
        label: shortLabel(key),
        amount,
      });
    }

    return days;
  }, [history]);

  const maxAmount = useMemo(() => {
    const values = last7Days.map((d) => d.amount);
    const max = Math.max(...values, 0);
    return max > 0 ? max : 2000;
  }, [last7Days]);

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Su Geçmişi</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Gün gün ne kadar su içtiğini burada görebilirsin.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl bg-white/50 px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-white/70"
          >
            Ana Sayfa
          </Link>
        </div>

        <div className="mb-6 rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium">Son 7 Gün</h2>
            <span className="text-xs text-neutral-500">
              En yüksek: {maxAmount} ml
            </span>
          </div>

          <div className="flex h-44 items-end justify-between gap-3">
            {last7Days.map((day) => {
              const heightPercent =
                maxAmount > 0 ? Math.max(6, (day.amount / maxAmount) * 100) : 6;

              return (
                <div
                  key={day.key}
                  className="flex flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-2 text-[11px] text-neutral-500">
                    {day.amount} ml
                  </div>

                  <div className="flex h-28 w-full items-end">
                    <div
                      className="w-full rounded-t-2xl bg-neutral-700 transition-all"
                      style={{ height: `${heightPercent}%` }}
                      title={`${day.label} - ${day.amount} ml`}
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-neutral-500">
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
            <p className="text-sm text-neutral-600">
              Henüz kayıtlı su geçmişi yok. Bugünden itibaren içtiğin su burada
              birikmeye başlayacak.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(([dateKey, data]) => (
              <div
                key={dateKey}
                className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">
                      {formatDateTr(dateKey)}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      {dateKey}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-semibold text-neutral-900">
                      {data.drankMl} ml
                    </div>
                    <div className="text-xs text-neutral-500">
                      toplam içilen
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}