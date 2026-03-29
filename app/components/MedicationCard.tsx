"use client";

import { useMemo } from "react";
import { useMedication } from "../hooks/useMedication";

type MedicationField =
  | "ironAlternateDone"
  | "berberineDone"
  | "glutamineDone"
  | "matofinDone"
  | "alcarDone"
  | "nacDone"
  | "b12Done"
  | "biotinDone"
  | "sipralexDone"
  | "dispeptaMorningDone"
  | "gstExtraDone"
  | "kreonDone"
  | "omepaDone"
  | "oceanDone"
  | "curcuminDone"
  | "dispeptaEveningDone"
  | "melatoninDone";

type MedicationSetCardProps = {
  title: string;
  labels: string[];
  notes: string[];
  done: boolean;
  onComplete: () => void;
  completedText: string;
  extraCompletedText?: string;
};

function MedicationSetCard({
  title,
  labels,
  notes,
  done,
  onComplete,
  completedText,
  extraCompletedText,
}: MedicationSetCardProps) {
  return (
    <div className="rounded-2xl bg-white/35 p-4 ring-1 ring-black/5">
      <p className="text-sm font-medium text-neutral-900">{title}</p>

      {!done ? (
        <>
          <div className="mt-3 space-y-2">
            {labels.map((label) => (
              <div
                key={label}
                className="rounded-2xl bg-white/50 px-3 py-2 text-sm text-neutral-700 ring-1 ring-black/5"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-white/40 p-3 text-xs text-neutral-600 ring-1 ring-black/5">
            {notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>

          <button
            onClick={onComplete}
            className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white/50 px-3 py-2 text-sm text-neutral-700 ring-1 ring-black/5 transition hover:bg-white/70"
          >
            <span>İçtim</span>
            <span className="ml-3 text-xs font-medium">Tamamla</span>
          </button>
        </>
      ) : (
        <div className="mt-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-200">
          <p className="text-sm font-medium text-green-700">✔ {completedText}</p>
          {extraCompletedText ? (
            <p className="mt-1 text-xs text-neutral-500">{extraCompletedText}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function MedicationCard() {
  const {
    medication,
    todayAlternateLabel,
    tomorrowAlternateLabel,
    toggleMedication,
    resetMedication,
  } = useMedication();

  const setDoneOnlyIfNeeded = (fields: MedicationField[]) => {
    fields.forEach((field) => {
      if (!medication[field]) {
        toggleMedication(field);
      }
    });
  };

  const preBreakfastDone = medication.ironAlternateDone;

  const beforeBreakfastDone =
    medication.berberineDone && medication.glutamineDone;

  const matofinDone = medication.matofinDone;

  const afterBreakfastDone =
    medication.alcarDone &&
    medication.nacDone &&
    medication.b12Done &&
    medication.biotinDone &&
    medication.sipralexDone &&
    medication.dispeptaMorningDone &&
    medication.gstExtraDone;

  const dinnerDone =
    medication.kreonDone &&
    medication.omepaDone &&
    medication.oceanDone &&
    medication.curcuminDone &&
    medication.dispeptaEveningDone;

  const sleepDone = medication.melatoninDone;

  const completedSetsCount = useMemo(() => {
    return [
      preBreakfastDone,
      beforeBreakfastDone,
      matofinDone,
      afterBreakfastDone,
      dinnerDone,
      sleepDone,
    ].filter(Boolean).length;
  }, [
    preBreakfastDone,
    beforeBreakfastDone,
    matofinDone,
    afterBreakfastDone,
    dinnerDone,
    sleepDone,
  ]);

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">İlaç & Takviye</h2>
        <span className="text-xs text-neutral-500">
          {completedSetsCount}/6 tamamlandı
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <MedicationSetCard
          title="🌅 Sabah aç karnına"
          labels={[todayAlternateLabel]}
          notes={[
            "⏳ 20–30 dk bekle",
            "☕ Kahve / çay 1 saat yok",
            "🥛 Süt ürünleri 1–2 saat yok",
            "💊 Başka takviye yok",
            "💧 1 bardak su ile, tek başına al",
          ]}
          done={preBreakfastDone}
          onComplete={() => setDoneOnlyIfNeeded(["ironAlternateDone"])}
          completedText="Sabah aç karnına tamamlandı"
          extraCompletedText={`Yarın sıra: ${tomorrowAlternateLabel}`}
        />

        <MedicationSetCard
          title="⏳ 20–30 dk sonra / kahvaltı öncesi"
          labels={["Berberine – 1 Adet", "Glutamin – 1 Saşe"]}
          notes={[
            "⏳ Berberine + Glutamin sonrası 10–15 dk bekle",
            "🍽 Sonra kahvaltı yap",
            "⚠️ Mide hassasiyeti olursa Berberine’yi kahvaltıya kaydır",
          ]}
          done={beforeBreakfastDone}
          onComplete={() =>
            setDoneOnlyIfNeeded(["berberineDone", "glutamineDone"])
          }
          completedText="Kahvaltı öncesi set tamamlandı"
        />

        <MedicationSetCard
          title="🍽 Kahvaltı sırasında"
          labels={["Matofin – 500 mg"]}
          notes={[
            "💊 Matofin’i kahvaltıda 1–2 lokma sonra al",
            "☕ Kahve istersen kahvaltı ile birlikte içebilirsin",
          ]}
          done={matofinDone}
          onComplete={() => setDoneOnlyIfNeeded(["matofinDone"])}
          completedText="Matofin tamamlandı"
        />

        <MedicationSetCard
          title="☀️ Kahvaltıdan hemen sonra"
          labels={[
            "L-Carnitine / ALCAR – 1 Adet",
            "NAC – 1 Adet",
            "B-12 – 1 Adet",
            "Biotin – 1 Adet",
            "Sipralex – 1 Adet",
            "Dispepta – 1 Adet",
            "GST Extra – 1 Saşe",
          ]}
          notes={[
            "✅ Kahvaltı biter bitmez alabilirsin",
            "☀️ ALCAR sabah alınır, akşama bırakılmaz",
            "💊 Sipralex her gün aynı saatte alınmalı",
            "🍃 Dispepta yemek sonrası sindirim için",
            "🧪 Biotin kullanıyorsan kan tahlili öncesi doktora/laba söyle",
            "☕ Kahveyi kahvaltı ile veya hemen sonrasında içebilirsin",
          ]}
          done={afterBreakfastDone}
          onComplete={() =>
            setDoneOnlyIfNeeded([
              "alcarDone",
              "nacDone",
              "b12Done",
              "biotinDone",
              "sipralexDone",
              "dispeptaMorningDone",
              "gstExtraDone",
            ])
          }
          completedText="Kahvaltı sonrası set tamamlandı"
        />

        <MedicationSetCard
          title="🌙 Akşam yemeği sonrasında"
          labels={[
            "Kreon – 1 Adet",
            "OmePa DK2 – 2 Adet",
            "Ocean D3 K2 – 8 damla",
            "Curcumin Pure – Ölçüne göre",
            "Dispepta – 1 Adet",
          ]}
          notes={[
            "🍽 Kreon akşam yemeğinin ilk lokmalarıyla alınır",
            "🍽 OmePa + Ocean D3 K2 + Curcumin yemekle birlikte daha uygundur",
            "🍃 Dispepta akşam yemeğinden sonra alınır",
          ]}
          done={dinnerDone}
          onComplete={() =>
            setDoneOnlyIfNeeded([
              "kreonDone",
              "omepaDone",
              "oceanDone",
              "curcuminDone",
              "dispeptaEveningDone",
            ])
          }
          completedText="Akşam seti tamamlandı"
        />

        <MedicationSetCard
          title="😴 Uyumadan 1 saat önce"
          labels={["Melatonin – 1 Adet"]}
          notes={["🌙 Melatonin yatmadan 30–60 dk önce alınır"]}
          done={sleepDone}
          onComplete={() => setDoneOnlyIfNeeded(["melatoninDone"])}
          completedText="Gece seti tamamlandı"
        />
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