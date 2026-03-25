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
        <h2 className="text-base font-medium">İlaç & Takviye</h2>
        <span className="text-xs text-neutral-500">
          {completedCount}/4 tamamlandı
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {!medication.preBreakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              🌅 Sabah aç karnına
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• {todayAlternateLabel}</li>
            </ul>

            <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
              <p>⏳ 20–30 dk bekle</p>
              <p>☕ Kahve / çay 1 saat yok</p>
              <p>🥛 Süt ürünleri 1–2 saat yok</p>
              <p>💊 Başka takviye yok</p>
              <p>💧 1 bardak su ile, tek başına al</p>
            </div>

            <button
              onClick={markPreBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 transition hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Sabah aç karnına demir / Lactoferrin tamamlandı
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Yarın sıra: {tomorrowAlternateLabel}
            </p>
          </div>
        )}

        {!medication.breakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              ⏳ 20–30 dk sonra
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Berberine – 1 Adet</li>
              <li>• Glutamin – 1 Adet</li>
              <li>• Matofin – 500 mg (kahvaltıda 1–2 lokma sonra)</li>
            </ul>

            <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
              <p>⏳ Berberine + glutamin sonrası 10–15 dk bekle</p>
              <p>🍽 Sonra kahvaltı yap</p>
              <p>☕ Kahve istersen kahvaltı ile birlikte içebilirsin</p>
              <p>⚠️ Mide hassasiyeti olursa berberineyi kahvaltıya kaydır</p>
            </div>

            <button
              onClick={markBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 transition hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Kahvaltı öncesi ve kahvaltı akışı tamamlandı
            </p>
          </div>
        )}

        {!medication.postBreakfastDone ? (
          <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
            <p className="text-sm font-medium text-neutral-900">
              ☀️ Kahvaltıdan hemen sonra
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• L-Carnitine / ALCAR – 1 Adet</li>
              <li>• NAC 600 – 1 Adet</li>
              <li>• B-12 – 1 Adet</li>
            </ul>

            <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
              <p>⏳ Son lokmadan sonra 30 dk bekleme yok</p>
              <p>✅ Kahvaltı biter bitmez alabilirsin</p>
              <p>☀️ ALCAR sabah alınır, akşama bırakılmaz</p>
              <p>☕ Kahveyi kahvaltı ile veya hemen sonrasında içebilirsin</p>
            </div>

            <button
              onClick={markPostBreakfastDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 transition hover:bg-white/70"
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
              🌙 Akşam yemeği + gece
            </p>

            <ul className="mt-3 space-y-1 text-sm text-neutral-700">
              <li>• Kreon – 1 Adet</li>
              <li>• OmePa DK2 – 2 Adet</li>
              <li>• Ocean D3 K2 – 8 damla</li>
              <li>• Prozac – 40 mg</li>
              <li>• Melatonin – 5 mg</li>
            </ul>

            <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
              <p>🍽 Kreon + OmePa DK2 + Ocean D3 K2 akşam yemeği ile birlikte</p>
              <p>🫒 Yağlı / normal bir öğünle almak daha iyi olur</p>
              <p>🌙 Melatonin yatmadan 30–60 dk önce</p>
              <p>💊 Prozac şimdilik sabit kalsın</p>
            </div>

            <button
              onClick={markEveningDone}
              className="mt-4 rounded-2xl bg-white/50 px-3 py-1.5 text-sm ring-1 ring-black/5 transition hover:bg-white/70"
            >
              İçtim
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-50 p-4 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700">
              ✔ Akşam ve gece ilaçları tamamlandı
            </p>
          </div>
        )}
      </div>

      <button
        onClick={resetMedication}
        className="mt-4 rounded-2xl bg-white/35 px-3 py-1.5 text-sm ring-1 ring-black/5 transition hover:bg-white/55"
      >
        Sıfırla
      </button>
    </div>
  );
}