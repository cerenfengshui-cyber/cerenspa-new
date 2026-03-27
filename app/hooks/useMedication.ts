"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type AlternateMorningMed = "osende" | "lactoferrin";

export type MedicationState = {
  dateKey: string;
  ironAlternateDone: boolean;
  berberineDone: boolean;
  glutamineDone: boolean;
  matofinDone: boolean;
  alcarDone: boolean;
  nacDone: boolean;
  b12Done: boolean;
  biotinDone: boolean;
  sipralexDone: boolean;
  dispeptaMorningDone: boolean;
  kreonDone: boolean;
  omepaDone: boolean;
  oceanDone: boolean;
  dispeptaEveningDone: boolean;
  melatoninDone: boolean;
};

function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Başlangıç günü: Osende Demir C
const ALT_START_DATE = "2026-03-11";

function daysBetween(startDateKey: string, targetDateKey: string) {
  const start = new Date(`${startDateKey}T00:00:00`);
  const target = new Date(`${targetDateKey}T00:00:00`);
  const diff = target.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getAlternateMorningForDate(dateKey: string): AlternateMorningMed {
  const diff = daysBetween(ALT_START_DATE, dateKey);
  return diff % 2 === 0 ? "osende" : "lactoferrin";
}

function getDateKeyWithOffset(dateKey: string, offsetDays: number) {
  const d = new Date(`${dateKey}T00:00:00`);
  d.setDate(d.getDate() + offsetDays);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function createEmptyMedicationState(dateKey: string): MedicationState {
  return {
    dateKey,
    ironAlternateDone: false,
    berberineDone: false,
    glutamineDone: false,
    matofinDone: false,
    alcarDone: false,
    nacDone: false,
    b12Done: false,
    biotinDone: false,
    sipralexDone: false,
    dispeptaMorningDone: false,
    kreonDone: false,
    omepaDone: false,
    oceanDone: false,
    dispeptaEveningDone: false,
    melatoninDone: false,
  };
}

function normalizeMedicationState(
  raw: Partial<MedicationState> | null | undefined,
  dateKey: string
): MedicationState {
  const empty = createEmptyMedicationState(dateKey);

  return {
    dateKey,
    ironAlternateDone: raw?.ironAlternateDone ?? empty.ironAlternateDone,
    berberineDone: raw?.berberineDone ?? empty.berberineDone,
    glutamineDone: raw?.glutamineDone ?? empty.glutamineDone,
    matofinDone: raw?.matofinDone ?? empty.matofinDone,
    alcarDone: raw?.alcarDone ?? empty.alcarDone,
    nacDone: raw?.nacDone ?? empty.nacDone,
    b12Done: raw?.b12Done ?? empty.b12Done,
    biotinDone: raw?.biotinDone ?? empty.biotinDone,
    sipralexDone: raw?.sipralexDone ?? empty.sipralexDone,
    dispeptaMorningDone:
      raw?.dispeptaMorningDone ?? empty.dispeptaMorningDone,
    kreonDone: raw?.kreonDone ?? empty.kreonDone,
    omepaDone: raw?.omepaDone ?? empty.omepaDone,
    oceanDone: raw?.oceanDone ?? empty.oceanDone,
    dispeptaEveningDone:
      raw?.dispeptaEveningDone ?? empty.dispeptaEveningDone,
    melatoninDone: raw?.melatoninDone ?? empty.melatoninDone,
  };
}

type MedicationField = Exclude<keyof MedicationState, "dateKey">;

export function useMedication() {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [medication, setMedication] = useState<MedicationState>(
    createEmptyMedicationState(todayKey)
  );

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const todayAlternate = useMemo(
    () => getAlternateMorningForDate(medication.dateKey),
    [medication.dateKey]
  );

  const tomorrowAlternate = useMemo(() => {
    const tomorrowKey = getDateKeyWithOffset(medication.dateKey, 1);
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
        console.error("[Medication] User alınamadı:", userError);
        setLoaded(true);
        return;
      }

      if (!user) {
        console.warn("[Medication] Giriş yapan kullanıcı yok.");
        setLoaded(true);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("pa_daily_state")
        .select("date_key, medication_state")
        .eq("user_id", user.id)
        .eq("date_key", todayKey)
        .maybeSingle();

      if (error) {
        console.error("[Medication] load error:", error);
        setLoaded(true);
        return;
      }

      if (data) {
        setMedication(
          normalizeMedicationState(
            (data.medication_state as Partial<MedicationState> | null) ?? null,
            data.date_key ?? todayKey
          )
        );
      } else {
        const freshState = createEmptyMedicationState(todayKey);
        setMedication(freshState);

        const { error: insertError } = await supabase
          .from("pa_daily_state")
          .upsert(
            {
              user_id: user.id,
              date_key: todayKey,
              medication_state: freshState,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,date_key" }
          );

        if (insertError) {
          console.error("[Medication] initial insert error:", insertError);
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
              medication_state?: Partial<MedicationState> | null;
            };

            if (row?.date_key !== todayKey) return;

            setMedication(
              normalizeMedicationState(row.medication_state, row.date_key ?? todayKey)
            );
          }
        )
        .subscribe();

      setLoaded(true);
    };

    loadMedication();

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (channel) supabase.removeChannel(channel);
    };
  }, [todayKey]);

  const saveMedication = useCallback(
    async (next: MedicationState) => {
      if (!userId) return;

      const { error } = await supabase.from("pa_daily_state").upsert(
        {
          user_id: userId,
          date_key: next.dateKey,
          medication_state: next,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" }
      );

      if (error) {
        console.error("[Medication] save error:", error);
      }
    },
    [userId]
  );

  const patchMedication = useCallback(
    (patch: Partial<MedicationState>) => {
      setMedication((prev) => {
        const next = { ...prev, ...patch };

        if (loaded) {
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

          saveTimerRef.current = setTimeout(() => {
            void saveMedication(next);
          }, 300);
        }

        return next;
      });
    },
    [loaded, saveMedication]
  );

  const markDone = useCallback(
    (field: MedicationField) => {
      patchMedication({ [field]: true } as Partial<MedicationState>);
    },
    [patchMedication]
  );

  const markUndone = useCallback(
    (field: MedicationField) => {
      patchMedication({ [field]: false } as Partial<MedicationState>);
    },
    [patchMedication]
  );

  const toggleMedication = useCallback(
    (field: MedicationField) => {
      setMedication((prev) => {
        const next = {
          ...prev,
          [field]: !prev[field],
        };

        if (loaded) {
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

          saveTimerRef.current = setTimeout(() => {
            void saveMedication(next);
          }, 300);
        }

        return next;
      });
    },
    [loaded, saveMedication]
  );

  const resetMedication = useCallback(() => {
    patchMedication(createEmptyMedicationState(medication.dateKey));
  }, [medication.dateKey, patchMedication]);

  const todayAlternateLabel =
    todayAlternate === "osende"
      ? "Osende Demir C – 1 Kapsül"
      : "Lactoferrin – 1 Kapsül";

  const tomorrowAlternateLabel =
    tomorrowAlternate === "osende"
      ? "Osende Demir C – 1 Kapsül"
      : "Lactoferrin – 1 Kapsül";

  const completedCount = useMemo(() => {
    const keys: MedicationField[] = [
      "ironAlternateDone",
      "berberineDone",
      "glutamineDone",
      "matofinDone",
      "alcarDone",
      "nacDone",
      "b12Done",
      "biotinDone",
      "sipralexDone",
      "dispeptaMorningDone",
      "kreonDone",
      "omepaDone",
      "oceanDone",
      "dispeptaEveningDone",
      "melatoninDone",
    ];

    return keys.reduce((sum, key) => sum + Number(medication[key]), 0);
  }, [medication]);

  const totalCount = 15;

  const preBreakfastCompleted = Number(medication.ironAlternateDone);

  const breakfastCompleted =
    Number(medication.berberineDone) +
    Number(medication.glutamineDone) +
    Number(medication.matofinDone);

  const postBreakfastCompleted =
    Number(medication.alcarDone) +
    Number(medication.nacDone) +
    Number(medication.b12Done) +
    Number(medication.biotinDone) +
    Number(medication.sipralexDone) +
    Number(medication.dispeptaMorningDone);

  const eveningCompleted =
    Number(medication.kreonDone) +
    Number(medication.omepaDone) +
    Number(medication.oceanDone) +
    Number(medication.dispeptaEveningDone) +
    Number(medication.melatoninDone);

  return {
    medication,
    loaded,
    userId,

    todayAlternate,
    tomorrowAlternate,
    todayAlternateLabel,
    tomorrowAlternateLabel,

    markDone,
    markUndone,
    toggleMedication,
    resetMedication,

    completedCount,
    totalCount,

    preBreakfastCompleted,
    breakfastCompleted,
    postBreakfastCompleted,
    eveningCompleted,
  };
}