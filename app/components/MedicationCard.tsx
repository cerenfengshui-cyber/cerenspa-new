"use client";

import { useMemo } from "react";
import { useMedication } from "../hooks/useMedication";

type MedicationField =
  | "ironComboDone"
  | "berberineMorningDone"
  | "dispeptaMorningDone"
  | "alcarMorningDone"
  | "nacMorningDone"
  | "kreonMorningDone"
  | "ligoneBerberisDone"
  | "b12Done"
  | "d3k2Done"
  | "lTheanineMorningDone"
  | "lCarnitineDone"
  | "berberineEveningDone"
  | "kreonEveningDone"
  | "dispeptaEveningDone"
  | "alcarEveningDone"
  | "omepaDone"
  | "nacEveningDone"
  | "lTheanineEveningDone"
  | "cipralexDone"
  | "melatoninDone";

type MedicationSetCardProps = {
  title: string;
  labels: string[];
  notes: string[];
  done: boolean;
  onComplete?: () => void;
  completedText: string;
  extraCompletedText?: string;
  buttonLabel?: string;
  passiveStateText?: string;
};

function MedicationSetCard({
  title,
  labels,
  notes,
  done,
  onComplete,
  completedText,
  extraCompletedText,
  buttonLabel = "İçtim",
  passiveStateText,
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

          {onComplete ? (
            <button
              onClick={onComplete}
              className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white/50 px-3 py-2 text-sm text-neutral-700 ring-1 ring-black/5 transition hover:bg-white/70"
            >
              <span>{buttonLabel}</span>
              <span className="ml-3 text-xs font-medium">Tamamla</span>
            </button>
          ) : passiveStateText ? (
            <div className="mt-3 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-200">
              <p className="text-sm font-medium text-amber-700">
                {passiveStateText}
              </p>
            </div>
          ) : null}
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
    isIronActiveDay,
    todayIronLabel,
    tomorrowIronLabel,
    isLTheanineMorningActive,
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

  const ironDone = isIronActiveDay ? medication.ironComboDone : true;

  const beforeBreakfastDone = medication.berberineMorningDone;

  const afterBreakfastFields: MedicationField[] = [
    "dispeptaMorningDone",
    "alcarMorningDone",
    "nacMorningDone",
    "kreonMorningDone",
    "ligoneBerberisDone",
    "b12Done",
    "d3k2Done",
  ];

  if (isLTheanineMorningActive) {
    afterBreakfastFields.push("lTheanineMorningDone");
  }

  const afterBreakfastDone = afterBreakfastFields.every(
    (field) => medication[field]
  );

  const sportDone = medication.lCarnitineDone;

  const beforeDinnerDone = medication.berberineEveningDone;

  const afterDinnerDone =
    medication.kreonEveningDone &&
    medication.dispeptaEveningDone &&
    medication.alcarEveningDone &&
    medication.omepaDone &&
    medication.nacEveningDone &&
    medication.lTheanineEveningDone;

  const cipralexDone = medication.cipralexDone;
  const melatoninDone = medication.melatoninDone;

  const completedSetsCount = useMemo(() => {
    return [
      ironDone,
      beforeBreakfastDone,
      afterBreakfastDone,
      beforeDinnerDone,
      afterDinnerDone,
      cipralexDone,
      melatoninDone,
    ].filter(Boolean).length;
  }, [
    ironDone,
    beforeBreakfastDone,
    afterBreakfastDone,
    beforeDinnerDone,
    afterDinnerDone,
    cipralexDone,
    melatoninDone,
  ]);

  const afterBreakfastLabels = [
    "Dispepta – 1 Adet",
    "ALCAR – 1 Adet",
    "NAC 600 – 1 Adet",
    "Kreon – 1 Adet",
    "Ligone Berberis – 1 Adet",
    "B-12 – 1 Adet",
    "D3-K2 – 8 Damla",
  ];

  if (isLTheanineMorningActive) {
    afterBreakfastLabels.push("L-Theanine – 1 Adet");
  }

  const afterBreakfastNotes = [
    "✅ Kahvaltıdan sonra tok karnına al",
    "🍽 Kreon’u yemeğin ilk lokmalarıyla almak daha uygundur",
    "💧 D3-K2 damlayı bu öğünde kullan",
  ];

  if (isLTheanineMorningActive) {
    afterBreakfastNotes.push(
      "🌿 L-Theanine bu tarihten itibaren sabah + akşam kullanılacak"
    );
  } else {
    afterBreakfastNotes.push(
      "🌿 L-Theanine şu an sadece akşam kullanılıyor, 1 hafta sonra sabaha da eklenecek"
    );
  }

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">İlaç & Takviye</h2>
        <span className="text-xs text-neutral-500">
          {completedSetsCount}/7 tamamlandı
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <MedicationSetCard
          title="🌅 Sabah aç karnına"
          labels={
            isIronActiveDay
              ? ["Osende Demir C – 2 Adet", "Lactoferrin – 1 Adet"]
              : ["Bugün demir günü değil"]
          }
          notes={
            isIronActiveDay
              ? [
                  "⏳ Aktif gün: ikisini birlikte al",
                  "☕ Kahve / çay en az 1 saat yok",
                  "🥛 Süt ürünleri 1–2 saat yok",
                  "💊 Mümkünse tek başına al",
                  "🌙 Doktor notu: istersen gece yatmadan önce de kullanılabilir",
                ]
              : [
                  "🫶 Bugün boş gün",
                  "📅 Bu protokol gün aşırı aktif gün / boş gün şeklinde ilerler",
                ]
          }
          done={ironDone}
          onComplete={
            isIronActiveDay
              ? () => setDoneOnlyIfNeeded(["ironComboDone"])
              : undefined
          }
          completedText={
            isIronActiveDay
              ? "Demir + Lactoferrin tamamlandı"
              : "Bugün demir protokolünde boş gündü"
          }
          extraCompletedText={`Yarın: ${tomorrowIronLabel}`}
          passiveStateText={!isIronActiveDay ? "Bugün boş gün" : undefined}
        />

        <MedicationSetCard
          title="⏳ Kahvaltıdan 20 dk önce"
          labels={["Berberine – 1 Adet"]}
          notes={[
            "⏳ Sonrasında yaklaşık 20 dk bekle",
            "🍽 Sonra kahvaltı yap",
          ]}
          done={beforeBreakfastDone}
          onComplete={() => setDoneOnlyIfNeeded(["berberineMorningDone"])}
          completedText="Kahvaltı öncesi Berberine tamamlandı"
        />

        <MedicationSetCard
          title="☀️ Kahvaltıdan sonra tok"
          labels={afterBreakfastLabels}
          notes={afterBreakfastNotes}
          done={afterBreakfastDone}
          onComplete={() => setDoneOnlyIfNeeded(afterBreakfastFields)}
          completedText="Kahvaltı sonrası set tamamlandı"
        />

        <MedicationSetCard
          title="🏃‍♀️ Spordan 30 dk önce (opsiyonel)"
          labels={["L-Carnitine (Solgar) 1000 mg – 1 Adet"]}
          notes={[
            "🏃‍♀️ Sadece spor yapılacak günlerde kullan",
            "⏱ Spordan yaklaşık 30 dk önce al",
            "📌 Bu alan isteğe bağlıdır, günlük zorunlu tamamlanma sayısına dahil edilmedi",
          ]}
          done={sportDone}
          onComplete={() => setDoneOnlyIfNeeded(["lCarnitineDone"])}
          completedText="Spor öncesi L-Carnitine tamamlandı"
          buttonLabel="Spor öncesi aldım"
        />

        <MedicationSetCard
          title="🌆 Akşam yemeğinden 30 dk önce"
          labels={["Berberine – 1 Adet"]}
          notes={[
            "⏳ Akşam yemeğinden yaklaşık 30 dk önce al",
            "🍽 Sonra akşam yemeğine geç",
          ]}
          done={beforeDinnerDone}
          onComplete={() => setDoneOnlyIfNeeded(["berberineEveningDone"])}
          completedText="Akşam öncesi Berberine tamamlandı"
        />

        <MedicationSetCard
          title="🌙 Akşam yemekten sonra tok"
          labels={[
            "Kreon – 1 Adet",
            "Dispepta – 1 Adet",
            "ALCAR – 1 Adet",
            "OmePa DK2 – 2 Adet",
            "NAC 600 – 1 Adet",
            "L-Theanine – 1 Adet",
          ]}
          notes={[
            "🍽 Kreon’u akşam yemeğinin ilk lokmalarıyla al",
            "🌿 L-Theanine ilk hafta sadece akşam kullanılır",
            "🌿 Sonrasında sabah + akşam devam eder",
          ]}
          done={afterDinnerDone}
          onComplete={() =>
            setDoneOnlyIfNeeded([
              "kreonEveningDone",
              "dispeptaEveningDone",
              "alcarEveningDone",
              "omepaDone",
              "nacEveningDone",
              "lTheanineEveningDone",
            ])
          }
          completedText="Akşam sonrası set tamamlandı"
        />

        <MedicationSetCard
          title="🕗 Akşam 20:00"
          labels={["Cipralex – 1 Adet"]}
          notes={[
            "🕗 Her gün sabit saat: 20:00",
            "📌 Mümkün olduğunca aynı saatte almaya çalış",
          ]}
          done={cipralexDone}
          onComplete={() => setDoneOnlyIfNeeded(["cipralexDone"])}
          completedText="Cipralex tamamlandı"
        />

        <MedicationSetCard
          title="🕘 Akşam 21:00"
          labels={["Melatonin – 1 Adet"]}
          notes={[
            "🕘 Her gün sabit saat: 21:00",
            "🌙 Uyku rutinini desteklemek için aynı saatte kalması iyi olur",
          ]}
          done={melatoninDone}
          onComplete={() => setDoneOnlyIfNeeded(["melatoninDone"])}
          completedText="Melatonin tamamlandı"
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