"use client";

import { useMedication } from "../hooks/useMedication";

export default function MedicationCard() {
  const {
    medication,
    todayAlternateLabel,
    tomorrowAlternateLabel,
    markPreBreakfastDone,
    markBreakfastDone,
    markPostBreakfastDone,
    markEveningDone,
    resetMedication,
    completedCount,
  } = useMedication();

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">İlaç</h2>
        <span className="text-xs text-neutral-500">
          {completedCount}/4 tamamlandı
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {!medication.preBreakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              Kahvaltıdan 20 dk önce
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Berberine – 1 Adet</li>
              <li>• Zedprex – 1 Adet</li>
              <li>• Glutamin – 1 Adet</li>
              <li>• {todayAlternateLabel}</li>
            </ul>

            <p className="mt-3 text-xs text-neutral-500">
              İçtikten 20 dk sonra kahvaltı
            </p>

            <button
              onClick={markPreBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Sabah aç karnına ilaçlar tamamlandı
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Yarın sıra: {tomorrowAlternateLabel}
            </p>
          </div>
        )}

        {!medication.breakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              Kahvaltıda 1–2 lokma sonra
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Matofin – 500 mg</li>
            </ul>

            <button
              onClick={markBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Kahvaltı ilaçları tamamlandı
            </p>
          </div>
        )}

        {!medication.postBreakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              Kahvaltıdan sonra tok
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Thyromazol – 2.5 MG</li>
              <li>• Dideral – Yarım</li>
              <li>• Dispepta – 1 Adet</li>
              <li>• L-Carnitine – 1 Adet</li>
              <li>• NAC 600 – 1 Adet</li>
              <li>• B-12 – 1 Adet</li>
              <li>• Kreon – 1 Adet</li>
            </ul>

            <button
              onClick={markPostBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Kahvaltı sonrası ilaçlar tamamlandı
            </p>
          </div>
        )}

        {!medication.eveningDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              Akşam yemekten sonra tok
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Dispepta – 1 Adet</li>
              <li>• L-Carnitine – 1 Adet</li>
              <li>• OmePa DK2 – 2 Adet</li>
              <li>• NAC 600 – 1 Adet</li>
              <li>• Melatonin – 1 Adet</li>
              <li>• GST – 1 Adet</li>
            </ul>

            <button
              onClick={markEveningDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Akşam ilaçları tamamlandı
            </p>
          </div>
        )}
      </div>

      <button
        onClick={resetMedication}
        className="mt-4 rounded-2xl bg-white/35 px-3 py-1.5 text-sm ring-1 ring-black/5 hover:bg-white/55"
      >
        Sıfırla
      </button>
    </div>
  );
}