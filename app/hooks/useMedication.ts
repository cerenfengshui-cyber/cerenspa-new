"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export type MedicationState = {
  dateKey: string;
  ironComboDone: boolean;
  berberineMorningDone: boolean;
  dispeptaMorningDone: boolean;
  alcarMorningDone: boolean;
  nacMorningDone: boolean;
  kreonMorningDone: boolean;
  ligoneBerberisDone: boolean;
  b12Done: boolean;
  d3k2Done: boolean;
  lTheanineMorningDone: boolean;
  lCarnitineDone: boolean;
  berberineEveningDone: boolean;
  kreonEveningDone: boolean;
  dispeptaEveningDone: boolean;
  alcarEveningDone: boolean;
  omepaDone: boolean;
  nacEveningDone: boolean;
  lTheanineEveningDone: boolean;
  cipralexDone: boolean;
  melatoninDone: boolean;
};

type MedicationField = Exclude<keyof MedicationState, "dateKey">;

const IRON_PATTERN_START_DATE = "2026-03-30";
const L_THEANINE_DOUBLE_START_DATE = "2026-04-07";

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function daysBetween(startDateKey: string, targetDateKey: string) {
  const start = parseDateKey(startDateKey);
  const target = parseDateKey(targetDateKey);
  const diff = target.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDateKeyWithOffset(dateKey: string, offsetDays: number) {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + offsetDays);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function isIronDay(dateKey: string) {
  const diff = daysBetween(IRON_PATTERN_START_DATE, dateKey);
  return diff % 2 === 0;
}

function isLTheanineMorningDay(dateKey: string) {
  return daysBetween(L_THEANINE_DOUBLE_START_DATE, dateKey) >= 0;
}

function createEmptyMedicationState(dateKey: string): MedicationState {
  return {
    dateKey,
    ironComboDone: false,
    berberineMorningDone: false,
    dispeptaMorningDone: false,
    alcarMorningDone: false,
    nacMorningDone: false,
    kreonMorningDone: false,
    ligoneBerberisDone: false,
    b12Done: false,
    d3k2Done: false,
    lTheanineMorningDone: false,
    lCarnitineDone: false,
    berberineEveningDone: false,
    kreonEveningDone: false,
    dispeptaEveningDone: false,
    alcarEveningDone: false,
    omepaDone: false,
    nacEveningDone: false,
    lTheanineEveningDone: false,
    cipralexDone: false,
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
    ironComboDone: raw?.ironComboDone ?? empty.ironComboDone,
    berberineMorningDone:
      raw?.berberineMorningDone ?? empty.berberineMorningDone,
    dispeptaMorningDone:
      raw?.dispeptaMorningDone ?? empty.dispeptaMorningDone,
    alcarMorningDone: raw?.alcarMorningDone ?? empty.alcarMorningDone,
    nacMorningDone: raw?.nacMorningDone ?? empty.nacMorningDone,
    kreonMorningDone: raw?.kreonMorningDone ?? empty.kreonMorningDone,
    ligoneBerberisDone:
      raw?.ligoneBerberisDone ?? empty.ligoneBerberisDone,
    b12Done: raw?.b12Done ?? empty.b12Done,
    d3k2Done: raw?.d3k2Done ?? empty.d3k2Done,
    lTheanineMorningDone:
      raw?.lTheanineMorningDone ?? empty.lTheanineMorningDone,
    lCarnitineDone: raw?.lCarnitineDone ?? empty.lCarnitineDone,
    berberineEveningDone:
      raw?.berberineEveningDone ?? empty.berberineEveningDone,
    kreonEveningDone: raw?.kreonEveningDone ?? empty.kreonEveningDone,
    dispeptaEveningDone:
      raw?.dispeptaEveningDone ?? empty.dispeptaEveningDone,
    alcarEveningDone: raw?.alcarEveningDone ?? empty.alcarEveningDone,
    omepaDone: raw?.omepaDone ?? empty.omepaDone,
    nacEveningDone: raw?.nacEveningDone ?? empty.nacEveningDone,
    lTheanineEveningDone:
      raw?.lTheanineEveningDone ?? empty.lTheanineEveningDone,
    cipralexDone: raw?.cipralexDone ?? empty.cipralexDone,
    melatoninDone: raw?.melatoninDone ?? empty.melatoninDone,
  };
}

export function useMedication() {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [medication, setMedication] = useState<MedicationState>(
    createEmptyMedicationState(todayKey)
  );

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestMedicationRef = useRef<MedicationState>(
    createEmptyMedicationState(todayKey)
  );
  const userIdRef = useRef<string | null>(null);

  const isIronActiveDay = useMemo(
    () => isIronDay(medication.dateKey),
    [medication.dateKey]
  );

  const tomorrowIronActiveDay = useMemo(() => {
    const tomorrowKey = getDateKeyWithOffset(medication.dateKey, 1);
    return isIronDay(tomorrowKey);
  }, [medication.dateKey]);

  const isLTheanineMorningActive = useMemo(
    () => isLTheanineMorningDay(medication.dateKey),
    [medication.dateKey]
  );

  const saveMedication = useCallback(
    async (next: MedicationState, forcedUserId?: string | null) => {
      const activeUserId = forcedUserId ?? userIdRef.current;

      console.log("[Medication] saveMedication called", {
        next,
        activeUserId,
      });

      if (!activeUserId) {
        console.warn("[Medication] user_id yok, save atlandı.");
        return;
      }

      const { error } = await supabase.from("pa_daily_state").upsert(
        {
          user_id: activeUserId,
          date_key: next.dateKey,
          medication_state: next,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" }
      );

      if (error) {
        console.error("[Medication] save error:", error);
        return;
      }

      console.log("[Medication] save success");
    },
    []
  );

  useEffect(() => {
    latestMedicationRef.current = medication;
  }, [medication]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadMedication = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[Medication] Session alınamadı:", sessionError);
        if (mounted) setLoaded(true);
        return;
      }

      const user = session?.user;

      if (!user) {
        console.warn("[Medication] Giriş yapan kullanıcı yok.");
        if (mounted) setLoaded(true);
        return;
      }

      if (!mounted) return;

      setUserId(user.id);
      userIdRef.current = user.id;

      const { data, error } = await supabase
        .from("pa_daily_state")
        .select("date_key, medication_state")
        .eq("user_id", user.id)
        .eq("date_key", todayKey)
        .maybeSingle();

      if (error) {
        console.error("[Medication] load error:", error);
        if (mounted) setLoaded(true);
        return;
      }

      if (data) {
        const normalized = normalizeMedicationState(
          (data.medication_state as Partial<MedicationState> | null) ?? null,
          data.date_key ?? todayKey
        );

        if (mounted) {
          setMedication(normalized);
          latestMedicationRef.current = normalized;
        }
      } else {
        const freshState = createEmptyMedicationState(todayKey);

        if (mounted) {
          setMedication(freshState);
          latestMedicationRef.current = freshState;
        }

        await saveMedication(freshState, user.id);
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

            if (!row?.date_key || row.date_key !== todayKey) return;

            const normalized = normalizeMedicationState(
              row.medication_state,
              row.date_key ?? todayKey
            );

            setMedication(normalized);
            latestMedicationRef.current = normalized;
          }
        )
        .subscribe();

      if (mounted) setLoaded(true);
    };

    void loadMedication();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user?.id ?? null;
      setUserId(nextUserId);
      userIdRef.current = nextUserId;
    });

    const flushOnLeave = () => {
      void saveMedication(latestMedicationRef.current, userIdRef.current);
    };

    window.addEventListener("pagehide", flushOnLeave);
    window.addEventListener("beforeunload", flushOnLeave);

    return () => {
      mounted = false;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (channel) supabase.removeChannel(channel);

      subscription.unsubscribe();
      window.removeEventListener("pagehide", flushOnLeave);
      window.removeEventListener("beforeunload", flushOnLeave);
    };
  }, [todayKey, saveMedication]);

  const scheduleSave = useCallback(
    (next: MedicationState) => {
      latestMedicationRef.current = next;

      console.log("[Medication] scheduleSave", next);

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        void saveMedication(next);
      }, 150);
    },
    [saveMedication]
  );

  const patchMedication = useCallback(
    (patch: Partial<MedicationState>) => {
      setMedication((prev) => {
        const next = { ...prev, ...patch };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
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
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const resetMedication = useCallback(() => {
    patchMedication(createEmptyMedicationState(medication.dateKey));
  }, [medication.dateKey, patchMedication]);

  const todayIronLabel = isIronActiveDay
    ? "Aktif gün: Osende Demir C – 2 Adet + Lactoferrin – 1 Adet"
    : "Boş gün";

  const tomorrowIronLabel = tomorrowIronActiveDay
    ? "Aktif gün: Osende Demir C – 2 Adet + Lactoferrin – 1 Adet"
    : "Boş gün";

  const completedCount = useMemo(() => {
    const keys: MedicationField[] = [
      "ironComboDone",
      "berberineMorningDone",
      "dispeptaMorningDone",
      "alcarMorningDone",
      "nacMorningDone",
      "kreonMorningDone",
      "ligoneBerberisDone",
      "b12Done",
      "d3k2Done",
      "lTheanineMorningDone",
      "lCarnitineDone",
      "berberineEveningDone",
      "kreonEveningDone",
      "dispeptaEveningDone",
      "alcarEveningDone",
      "omepaDone",
      "nacEveningDone",
      "lTheanineEveningDone",
      "cipralexDone",
      "melatoninDone",
    ];

    return keys.reduce((sum, key) => sum + Number(medication[key]), 0);
  }, [medication]);

  const totalCount = 20;

  const requiredCompletedCount = useMemo(() => {
    const count =
      Number(isIronActiveDay ? medication.ironComboDone : true) +
      Number(medication.berberineMorningDone) +
      Number(medication.dispeptaMorningDone) +
      Number(medication.alcarMorningDone) +
      Number(medication.nacMorningDone) +
      Number(medication.kreonMorningDone) +
      Number(medication.ligoneBerberisDone) +
      Number(medication.b12Done) +
      Number(medication.d3k2Done) +
      Number(medication.berberineEveningDone) +
      Number(medication.kreonEveningDone) +
      Number(medication.dispeptaEveningDone) +
      Number(medication.alcarEveningDone) +
      Number(medication.omepaDone) +
      Number(medication.nacEveningDone) +
      Number(medication.lTheanineEveningDone) +
      Number(medication.cipralexDone) +
      Number(medication.melatoninDone);

    return isLTheanineMorningActive
      ? count + Number(medication.lTheanineMorningDone)
      : count;
  }, [isIronActiveDay, isLTheanineMorningActive, medication]);

  const requiredTotalCount = isLTheanineMorningActive ? 19 : 18;

  return {
    medication,
    loaded,
    userId,
    isIronActiveDay,
    todayIronLabel,
    tomorrowIronLabel,
    isLTheanineMorningActive,
    markDone,
    markUndone,
    toggleMedication,
    resetMedication,
    completedCount,
    totalCount,
    requiredCompletedCount,
    requiredTotalCount,
  };
}