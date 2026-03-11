"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export function useMedication() {
  const [medication, setMedication] = useState<MedicationData>({
    dateKey: getTodayKey(),
    preBreakfastDone: false,
    breakfastDone: false,
    postBreakfastDone: false,
    eveningDone: false,
    alternateMorning: "osende",
  });

  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadMedication = async () => {
      const today = getTodayKey();

      const { data, error } = await supabase
        .from("medication_status")
        .select("*")
        .eq("date_key", today)
        .maybeSingle();

      if (error) {
        console.error("Medication load error:", error);
        setLoaded(true);
        return;
      }

      if (data) {
        setMedication({
          dateKey: today,
          preBreakfastDone: data.pre_breakfast_done ?? false,
          breakfastDone: data.breakfast_done ?? false,
          postBreakfastDone: data.post_breakfast_done ?? false,
          eveningDone: data.evening_done ?? false,
          alternateMorning:
            (data.alternate_morning as AlternateMorningMed) ?? "osende",
        });
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = `${yesterday.getFullYear()}-${String(
          yesterday.getMonth() + 1
        ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

        const { data: yData } = await supabase
          .from("medication_status")
          .select("alternate_morning")
          .eq("date_key", yKey)
          .maybeSingle();

        setMedication({
          dateKey: today,
          preBreakfastDone: false,
          breakfastDone: false,
          postBreakfastDone: false,
          eveningDone: false,
          alternateMorning:
            yData?.alternate_morning === "osende" ? "lactoferin" : "osende",
        });
      }

      setLoaded(true);
    };

    loadMedication();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const { error } = await supabase.from("medication_status").upsert(
        [
          {
            date_key: medication.dateKey,
            pre_breakfast_done: medication.preBreakfastDone,
            breakfast_done: medication.breakfastDone,
            post_breakfast_done: medication.postBreakfastDone,
            evening_done: medication.eveningDone,
            alternate_morning: medication.alternateMorning,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "date_key" }
      );

      if (error) {
        console.error("Medication save error:", error);
      }
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [medication, loaded]);

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