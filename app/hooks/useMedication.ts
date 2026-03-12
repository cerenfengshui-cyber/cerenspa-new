"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type AlternateMorningMed = "osende" | "lactoferin";

type MedicationData = {
  dateKey: string;
  preBreakfastDone: boolean;
  breakfastDone: boolean;
  postBreakfastDone: boolean;
  eveningDone: boolean;
};

function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Bu tarihi "Osende günü" olarak kabul ediyoruz.
// Ertesi gün otomatik Lactoferin, sonra yine Osende...
const ALT_START_DATE = "2026-03-11";

function daysBetween(startDateKey: string, targetDateKey: string) {
  const start = new Date(`${startDateKey}T00:00:00`);
  const target = new Date(`${targetDateKey}T00:00:00`);
  const diff = target.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getAlternateMorningForDate(dateKey: string): AlternateMorningMed {
  const diff = daysBetween(ALT_START_DATE, dateKey);
  return diff % 2 === 0 ? "osende" : "lactoferin";
}

export function useMedication() {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [medication, setMedication] = useState<MedicationData>({
    dateKey: todayKey,
    preBreakfastDone: false,
    breakfastDone: false,
    postBreakfastDone: false,
    eveningDone: false,
  });

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const todayAlternate = useMemo(
    () => getAlternateMorningForDate(medication.dateKey),
    [medication.dateKey]
  );

  const tomorrowAlternate = useMemo(() => {
    const d = new Date(`${medication.dateKey}T00:00:00`);
    d.setDate(d.getDate() + 1);
    const tomorrowKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;

    return getAlternateMorningForDate(tomorrowKey);
  }, [medication.dateKey]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadMedication = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User alınamadı:", userError);
        setLoaded(true);
        return;
      }

      if (!user) {
        console.warn("Giriş yapan kullanıcı yok.");
        setLoaded(true);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("pa_daily_state")
        .select(
          "date_key, pre_breakfast_done, breakfast_done, post_breakfast_done, evening_done"
        )
        .eq("user_id", user.id)
        .eq("date_key", todayKey)
        .maybeSingle();

      if (error) {
        console.error("Medication load error:", error);
        setLoaded(true);
        return;
      }

      if (data) {
        setMedication({
          dateKey: data.date_key ?? todayKey,
          preBreakfastDone: data.pre_breakfast_done ?? false,
          breakfastDone: data.breakfast_done ?? false,
          postBreakfastDone: data.post_breakfast_done ?? false,
          eveningDone: data.evening_done ?? false,
        });
      } else {
        const freshState = {
          dateKey: todayKey,
          preBreakfastDone: false,
          breakfastDone: false,
          postBreakfastDone: false,
          eveningDone: false,
        };

        setMedication(freshState);

        const { error: insertError } = await supabase.from("pa_daily_state").upsert(
          {
            user_id: user.id,
            date_key: todayKey,
            pre_breakfast_done: false,
            breakfast_done: false,
            post_breakfast_done: false,
            evening_done: false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,date_key" }
        );

        if (insertError) {
          console.error("Medication initial insert error:", insertError);
        }
      }

      channel = supabase
        .channel(`pa_daily_state_medication_${user.id}_${todayKey}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pa_daily_state",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const row = payload.new as {
              date_key?: string;
              pre_breakfast_done?: boolean;
              breakfast_done?: boolean;
              post_breakfast_done?: boolean;
              evening_done?: boolean;
            };

            if (row?.date_key !== todayKey) return;

            setMedication({
              dateKey: row.date_key ?? todayKey,
              preBreakfastDone: row.pre_breakfast_done ?? false,
              breakfastDone: row.breakfast_done ?? false,
              postBreakfastDone: row.post_breakfast_done ?? false,
              eveningDone: row.evening_done ?? false,
            });
          }
        )
        .subscribe();

      setLoaded(true);
    };

    loadMedication();

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [todayKey]);

  const saveMedication = useCallback(
    async (next: MedicationData) => {
      if (!userId) return;

      const { error } = await supabase.from("pa_daily_state").upsert(
        {
          user_id: userId,
          date_key: next.dateKey,
          pre_breakfast_done: next.preBreakfastDone,
          breakfast_done: next.breakfastDone,
          post_breakfast_done: next.postBreakfastDone,
          evening_done: next.eveningDone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" }
      );

      if (error) {
        console.error("Medication save error:", error);
      }
    },
    [userId]
  );

  const patchMedication = useCallback(
    (patch: Partial<MedicationData>) => {
      setMedication((prev) => {
        const next = { ...prev, ...patch };

        if (loaded) {
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

          saveTimerRef.current = setTimeout(() => {
            saveMedication(next);
          }, 300);
        }

        return next;
      });
    },
    [loaded, saveMedication]
  );

  const todayAlternateLabel =
    todayAlternate === "osende"
      ? "Osende Demir C – 2 Adet"
      : "Lactoferin – 1 Adet";

  const tomorrowAlternateLabel =
    tomorrowAlternate === "osende"
      ? "Osende Demir C – 2 Adet"
      : "Lactoferin – 1 Adet";

  const markPreBreakfastDone = () => {
    patchMedication({
      preBreakfastDone: true,
    });
  };

  const markBreakfastDone = () => {
    patchMedication({
      breakfastDone: true,
    });
  };

  const markPostBreakfastDone = () => {
    patchMedication({
      postBreakfastDone: true,
    });
  };

  const markEveningDone = () => {
    patchMedication({
      eveningDone: true,
    });
  };

  const resetMedication = () => {
    patchMedication({
      preBreakfastDone: false,
      breakfastDone: false,
      postBreakfastDone: false,
      eveningDone: false,
    });
  };

  const completedCount =
    Number(medication.preBreakfastDone) +
    Number(medication.breakfastDone) +
    Number(medication.postBreakfastDone) +
    Number(medication.eveningDone);

  return {
    medication,
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