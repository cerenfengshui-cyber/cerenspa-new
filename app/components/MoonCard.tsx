"use client";

import React from "react";
import { useMoonPhase } from "../hooks/useMoonPhase";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/5 bg-white/55 px-3 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur-md">
      {children}
    </span>
  );
}

function MoonIcon({ phase }: { phase: string }) {
  if (phase.includes("Dolunay")) return "🌕";
  if (phase.includes("Yeni")) return "🌑";
  if (phase.includes("İlk")) return "🌓";
  if (phase.includes("Son")) return "🌗";
  if (phase.includes("Büyüyen")) return "🌔";
  if (phase.includes("Küçülen")) return "🌖";
  return "🌙";
}

function getCycleStage(phase: string) {
  if (phase.includes("Küçülen") || phase.includes("Son")) {
    return "waning";
  }

  return "waxing";
}

function getGuidance(phase: string) {
  if (phase.includes("Yeni")) {
    return {
      energy: "İçe dönüş ve yenilenme.",
      focus: "Niyet, dinlenme, sade plan.",
      do: [
        "Kısa bir niyet yaz.",
        "Bugünü hafiflet.",
        "Küçük ama temiz bir başlangıç yap.",
      ],
      dont: [
        "Büyük kararları zorlama.",
        "Kendini aşırı yükleme.",
        "Her şeyi aynı anda başlatma.",
      ],
    };
  }

  if (phase.includes("İlk")) {
    return {
      energy: "İvme ve netleşme.",
      focus: "Karar verip ilerleme.",
      do: [
        "Tek bir öncelik seç.",
        "Bekleyen bir işi başlat.",
        "Küçük engelleri temizle.",
      ],
      dont: [
        "Kararsızlığı uzatma.",
        "Dikkatini dağıtma.",
        "Kendini sert eleştirme.",
      ],
    };
  }

  if (phase.includes("Dolunay")) {
    return {
      energy: "Duygular yükselir, görünürlük artar.",
      focus: "Tamamlama ve farkındalık.",
      do: [
        "Bir işi tamamla.",
        "Duygularına nazik yaklaş.",
        "Biraz daha yavaş ve bilinçli ilerle.",
      ],
      dont: [
        "Ani karar verme.",
        "Tartışmaları büyütme.",
        "Aşırı yüklenme.",
      ],
    };
  }

  if (phase.includes("Son")) {
    return {
      energy: "Arınma ve sınır koyma.",
      focus: "Kapanışlar, temizlik, sadeleşme.",
      do: [
        "Bir şeyi kapat veya bırak.",
        "Alanını toparla.",
        "Enerjini koruyacak sınırlar koy.",
      ],
      dont: [
        "Yeni büyük yük alma.",
        "Eskiyi zorla taşıma.",
        "Gereksiz şeye evet deme.",
      ],
    };
  }

  if (phase.includes("Küçülen")) {
    return {
      energy: "Sakinleşme ve içe dönüş.",
      focus: "Bırakma, dinlenme, değerlendirme.",
      do: [
        "Yarım kalanları sadeleştir.",
        "Biraz dinlen.",
        "Neyi bırakman gerektiğini fark et.",
      ],
      dont: [
        "Yeni büyük işe atlama.",
        "Kendini performansla ölçme.",
        "Aşırı hızlanma.",
      ],
    };
  }

  return {
    energy: "Yavaşça yükselen motivasyon.",
    focus: "Başlangıç, ritim kurma, küçük adımlar.",
    do: [
      "Yeni bir şeye küçükten başla.",
      "Ritmini oluştur.",
      "İlk adımı at.",
    ],
    dont: [
      "Mükemmel olmasını bekleme.",
      "Aynı anda her şeye başlama.",
      "Kendini aceleye getirme.",
    ],
  };
}

export default function MoonCard() {
  const { moon } = useMoonPhase();

  if (!moon) {
    return (
      <div className="h-full rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-medium">Ay Döngüsü</h2>
        </div>

        <div className="mt-4 text-sm text-neutral-700">
          Ay bilgisi yükleniyor…
        </div>
      </div>
    );
  }

  const cycleStage = getCycleStage(moon.phase);
  const guidance = getGuidance(moon.phase);

  return (
    <div className="h-full rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">Ay Döngüsü</h2>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">
            <MoonIcon phase={moon.phase} />
          </div>

          <div>
            <div className="text-sm font-semibold">{moon.phase}</div>

            <div className="text-xs text-neutral-500">
              {cycleStage === "waxing" ? "Büyüyen Ay" : "Küçülen Ay"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill>
            Ay Günü
            <b className="ml-1">{moon.lunarDay}</b>
          </Pill>

          <Pill>
            Aydınlanma
            <b className="ml-1">%{moon.illumination}</b>
          </Pill>

          <Pill>
            Akış
            <b className="ml-1">
              {cycleStage === "waxing" ? "Büyüyen" : "Küçülen"}
            </b>
          </Pill>
        </div>

        <div className="text-sm text-neutral-800">
          <span className="text-neutral-500">Hissiyat:</span>{" "}
          {guidance.energy}
          <br />
          <span className="text-neutral-500">Odak:</span>{" "}
          {guidance.focus}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white/55 p-4">
            <div className="text-xs tracking-wider text-neutral-500">
              ŞUNU YAP
            </div>

            <ul className="mt-2 space-y-1 text-sm">
              {guidance.do.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/55 p-4">
            <div className="text-xs tracking-wider text-neutral-500">
              ŞUNU YAPMA
            </div>

            <ul className="mt-2 space-y-1 text-sm">
              {guidance.dont.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}