"use client";

import { useEffect, useState } from "react";

type AlternateMorningMed = "osende" | "lactoferin";

type MedicationData = {
  dateKey: string;
  preBreakfastDone: boolean;
  breakfastDone: boolean;
  postBreakfastDone: boolean;
  eveningDone: boolean;
  alternateMorning: AlternateMorningMed;
};

function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const STORAGE_KEY = "cerenspa:medication:v3";

export function useMedication() {
  const [medication, setMedication] = useState<MedicationData>({
    dateKey: getTodayKey(),
    preBreakfastDone: false,
    breakfastDone: false,
    postBreakfastDone: false,
    eveningDone: false,
    alternateMorning: "osende",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as MedicationData;
      const today = getTodayKey();

      if (parsed.dateKey === today) {
        setMedication({
          dateKey: today,
          preBreakfastDone: parsed.preBreakfastDone ?? false,
          breakfastDone: parsed.breakfastDone ?? false,
          postBreakfastDone: parsed.postBreakfastDone ?? false,
          eveningDone: parsed.eveningDone ?? false,
          alternateMorning: parsed.alternateMorning ?? "osende",
        });
      } else {
        setMedication({
          dateKey: today,
          preBreakfastDone: false,
          breakfastDone: false,
          postBreakfastDone: false,
          eveningDone: false,
          alternateMorning: parsed.alternateMorning ?? "osende",
        });
      }
    } catch {
      // sessiz geç
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medication));
    } catch {
      // sessiz geç
    }
  }, [medication]);

  const todayAlternateLabel =
    medication.alternateMorning === "osende"
      ? "Osende Demir C – 2 Adet"
      : "Lactoferin – 1 Adet";

  const tomorrowAlternateLabel =
    medication.alternateMorning === "osende"
      ? "Lactoferin – 1 Adet"
      : "Osende Demir C – 2 Adet";

  const markPreBreakfastDone = () => {
    setMedication((prev) => ({
      ...prev,
      preBreakfastDone: true,
      alternateMorning:
        prev.alternateMorning === "osende" ? "lactoferin" : "osende",
    }));
  };

  const markBreakfastDone = () => {
    setMedication((prev) => ({
      ...prev,
      breakfastDone: true,
    }));
  };

  const markPostBreakfastDone = () => {
    setMedication((prev) => ({
      ...prev,
      postBreakfastDone: true,
    }));
  };

  const markEveningDone = () => {
    setMedication((prev) => ({
      ...prev,
      eveningDone: true,
    }));
  };

  const resetMedication = () => {
    setMedication((prev) => ({
      ...prev,
      preBreakfastDone: false,
      breakfastDone: false,
      postBreakfastDone: false,
      eveningDone: false,
    }));
  };

  const completedCount =
    Number(medication.preBreakfastDone) +
    Number(medication.breakfastDone) +
    Number(medication.postBreakfastDone) +
    Number(medication.eveningDone);

  return {
    medication,
    setMedication,
    todayAlternateLabel,
    tomorrowAlternateLabel,
    markPreBreakfastDone,
    markBreakfastDone,
    markPostBreakfastDone,
    markEveningDone,
    resetMedication,
    completedCount,
  };
}