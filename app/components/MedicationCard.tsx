// MedicationCard.tsx
"use client";

import { useMedication } from "../hooks/useMedication";

type MedicationButtonProps = {
  label: string;
  done: boolean;
  onClick: () => void;
};

function MedicationButton({
  label,
  done,
  onClick,
}: MedicationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm ring-1 transition",
        done
          ? "bg-green-50 text-green-700 ring-green-200"
          : "bg-white/50 text-neutral-700 ring-black/5 hover:bg-white/70",
      ].join(" ")}
    >
      <span>{label}</span>
      <span className="ml-3 text-xs font-medium">
        {done ? "İçildi" : "İçtim"}
      </span>
    </button>
  );
}

export default function MedicationCard() {
  const {
    medication,
    todayAlternateLabel,
    tomorrowAlternateLabel,
    toggleMedication,
    resetMedication,
    completedCount,
    totalCount,
    preBreakfastCompleted,
    breakfastCompleted,
    postBreakfastCompleted,
    eveningCompleted,
  } = useMedication();

  const preBreakfastTotal = 1;
  const breakfastTotal = 3;
  const postBreakfastTotal = 7;
  const eveningTotal = 6;

  const preBreakfastDone = preBreakfastCompleted === preBreakfastTotal;
  const breakfastDone = breakfastCompleted === breakfastTotal;
  const postBreakfastDone = postBreakfastCompleted === postBreakfastTotal;
  const eveningDone = eveningCompleted === eveningTotal;

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">İlaç & Takviye</h2>
        <span className="text-xs text-neutral-500">
          {completedCount}/{totalCount} tamamlandı
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              🌅 Sabah aç karnına
            </p>
            <span className="text-xs text-neutral-500">
              {preBreakfastCompleted}/{preBreakfastTotal}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <MedicationButton
              label={todayAlternateLabel}
              done={medication.ironAlternateDone}
              onClick={() => toggleMedication("ironAlternateDone")}
            />
          </div>

          <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
            <p>⏳ 20–30 dk bekle</p>
            <p>☕ Kahve / çay 1 saat yok</p>
            <p>🥛 Süt ürünleri 1–2 saat yok</p>
            <p>💊 Başka takviye yok</p>
            <p>💧 1 bardak su ile, tek başına al</p>
          </div>

          {preBreakfastDone && (
            <div className="mt-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-200">
              <p className="text-sm font-medium text-green-700">
                ✔ Sabah aç karnına ilaç tamamlandı
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Yarın sıra: {tomorrowAlternateLabel}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              ⏳ 20–30 dk sonra / kahvaltı öncesi
            </p>
            <span className="text-xs text-neutral-500">
              {breakfastCompleted}/{breakfastTotal}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <MedicationButton
              label="Berberine – 1 Adet"
              done={medication.berberineDone}
              onClick={() => toggleMedication("berberineDone")}
            />

            <MedicationButton
              label="Glutamin – 1 Saşe"
              done={medication.glutamineDone}
              onClick={() => toggleMedication("glutamineDone")}
            />

            <MedicationButton
              label="Matofin – 500 mg"
              done={medication.matofinDone}
              onClick={() => toggleMedication("matofinDone")}
            />
          </div>

          <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
            <p>⏳ Berberine + Glutamin sonrası 10–15 dk bekle</p>
            <p>🍽 Sonra kahvaltı yap</p>
            <p>💊 Matofin’i kahvaltıda 1–2 lokma sonra al</p>
            <p>☕ Kahve istersen kahvaltı ile birlikte içebilirsin</p>
            <p>⚠️ Mide hassasiyeti olursa Berberine’yi kahvaltıya kaydır</p>
          </div>

          {breakfastDone && (
            <div className="mt-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-200">
              <p className="text-sm font-medium text-green-700">
                ✔ Kahvaltı öncesi ve kahvaltı akışı tamamlandı
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              ☀️ Kahvaltıdan hemen sonra
            </p>
            <span className="text-xs text-neutral-500">
              {postBreakfastCompleted}/{postBreakfastTotal}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <MedicationButton
              label="L-Carnitine / ALCAR – 1 Adet"
              done={medication.alcarDone}
              onClick={() => toggleMedication("alcarDone")}
            />

            <MedicationButton
              label="NAC – 1 Adet"
              done={medication.nacDone}
              onClick={() => toggleMedication("nacDone")}
            />

            <MedicationButton
              label="B-12 – 1 Adet"
              done={medication.b12Done}
              onClick={() => toggleMedication("b12Done")}
            />

            <MedicationButton
              label="Biotin – 1 Adet"
              done={medication.biotinDone}
              onClick={() => toggleMedication("biotinDone")}
            />

            <MedicationButton
              label="Sipralex – 1 Adet"
              done={medication.sipralexDone}
              onClick={() => toggleMedication("sipralexDone")}
            />

            <MedicationButton
              label="Dispepta – 1 Adet"
              done={medication.dispeptaMorningDone}
              onClick={() => toggleMedication("dispeptaMorningDone")}
            />

            <MedicationButton
              label="GST Extra – 1 Saşe"
              done={medication.gstExtraDone}
              onClick={() => toggleMedication("gstExtraDone")}
            />
          </div>

          <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
            <p>✅ Kahvaltı biter bitmez alabilirsin</p>
            <p>☀️ ALCAR sabah alınır, akşama bırakılmaz</p>
            <p>💊 Sipralex her gün aynı saatte alınmalı</p>
            <p>🍃 Dispepta yemek sonrası sindirim için</p>
            <p>🧪 Biotin kullanıyorsan kan tahlili öncesi doktora/laba söyle</p>
            <p>☕ Kahveyi kahvaltı ile veya hemen sonrasında içebilirsin</p>
          </div>

          {postBreakfastDone && (
            <div className="mt-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-200">
              <p className="text-sm font-medium text-green-700">
                ✔ Kahvaltı sonrası ilaçlar tamamlandı
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-neutral-900">
              🌙 Akşam yemeği + gece
            </p>
            <span className="text-xs text-neutral-500">
              {eveningCompleted}/{eveningTotal}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <MedicationButton
              label="Kreon – 1 Adet"
              done={medication.kreonDone}
              onClick={() => toggleMedication("kreonDone")}
            />

            <MedicationButton
              label="OmePa DK2 – 2 Adet"
              done={medication.omepaDone}
              onClick={() => toggleMedication("omepaDone")}
            />

            <MedicationButton
              label="Ocean D3 K2 – 8 damla"
              done={medication.oceanDone}
              onClick={() => toggleMedication("oceanDone")}
            />

            <MedicationButton
              label="Curcumin Pure – Ölçüne göre"
              done={medication.curcuminDone}
              onClick={() => toggleMedication("curcuminDone")}
            />

            <MedicationButton
              label="Dispepta – 1 Adet"
              done={medication.dispeptaEveningDone}
              onClick={() => toggleMedication("dispeptaEveningDone")}
            />

            <MedicationButton
              label="Melatonin – 1 Adet"
              done={medication.melatoninDone}
              onClick={() => toggleMedication("melatoninDone")}
            />
          </div>

          <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
            <p>🍽 Kreon akşam yemeğinin ilk lokmalarıyla alınır</p>
            <p>🍽 OmePa + Ocean D3 K2 + Curcumin yemekle birlikte daha uygundur</p>
            <p>🍃 Dispepta akşam yemeğinden sonra alınır</p>
            <p>🌙 Melatonin yatmadan 30–60 dk önce</p>
          </div>

          {eveningDone && (
            <div className="mt-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-200">
              <p className="text-sm font-medium text-green-700">
                ✔ Akşam ve gece ilaçları tamamlandı
              </p>
            </div>
          )}
        </div>
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