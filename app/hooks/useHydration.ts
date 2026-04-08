"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export type HydrationData = {
  dateKey: string;
  drankMl: number;
  weightKg: number;
};

type DailyStateRow = {
  date_key: string;
  drank_ml?: number | null;
  weight_kg?: number | null;
};

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

function getDateKeyWithOffset(dateKey: string, offsetDays: number) {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + offsetDays);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function createDefaultHydration(dateKey: string): HydrationData {
  return {
    dateKey,
    drankMl: 0,
    weightKg: 60,
  };
}

function normalizeHydration(
  row: DailyStateRow | null | undefined,
  dateKey: string,
  fallbackWeightKg = 60
): HydrationData {
  return {
    dateKey,
    drankMl: row?.drank_ml ?? 0,
    weightKg: row?.weight_kg ?? fallbackWeightKg,
  };
}

export function useHydration(isLodos: boolean = false) {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [hydration, setHydrationState] = useState<HydrationData>(
    createDefaultHydration(todayKey)
  );
  const [lastWeekAmount, setLastWeekAmount] = useState<number>(0);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestHydrationRef = useRef<HydrationData>(
    createDefaultHydration(todayKey)
  );
  const userIdRef = useRef<string | null>(null);

  const saveHydration = useCallback(
    async (next: HydrationData, forcedUserId?: string | null) => {
      const activeUserId = forcedUserId ?? userIdRef.current;
      if (!activeUserId) return;

      const { error } = await supabase.from("pa_daily_state").upsert(
        {
          user_id: activeUserId,
          date_key: next.dateKey,
          drank_ml: next.drankMl,
          weight_kg: next.weightKg,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" }
      );

      if (error) {
        console.error("[Hydration] save error:", error);
      }
    },
    []
  );

  useEffect(() => {
    latestHydrationRef.current = hydration;
  }, [hydration]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadHydration = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[Hydration] Session alınamadı:", sessionError);
        if (mounted) setIsLoaded(true);
        return;
      }

      const user = session?.user;

      if (!user) {
        console.warn("[Hydration] Giriş yapan kullanıcı yok.");
        if (mounted) setIsLoaded(true);
        return;
      }

      if (!mounted) return;

      setUserId(user.id);
      userIdRef.current = user.id;

      const { data: todayRow, error: todayError } = await supabase
        .from("pa_daily_state")
        .select("date_key, drank_ml, weight_kg")
        .eq("user_id", user.id)
        .eq("date_key", todayKey)
        .maybeSingle();

      if (todayError) {
        console.error("[Hydration] load today error:", todayError);
      }

      let resolvedWeight = 60;

      if (todayRow) {
        const normalized = normalizeHydration(todayRow, todayKey, 60);
        resolvedWeight = normalized.weightKg;

        if (mounted) {
          setHydrationState(normalized);
          latestHydrationRef.current = normalized;
        }
      } else {
        const { data: latestWeightRow, error: latestWeightError } =
          await supabase
            .from("pa_daily_state")
            .select("weight_kg")
            .eq("user_id", user.id)
            .not("weight_kg", "is", null)
            .order("date_key", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (latestWeightError) {
          console.error("[Hydration] latest weight error:", latestWeightError);
        }

        resolvedWeight = latestWeightRow?.weight_kg ?? 60;

        const freshState = createDefaultHydration(todayKey);
        freshState.weightKg = resolvedWeight;

        if (mounted) {
          setHydrationState(freshState);
          latestHydrationRef.current = freshState;
        }

        await saveHydration(freshState, user.id);
      }

      const lastWeekKey = getDateKeyWithOffset(todayKey, -7);

      const { data: lastWeekRow, error: lastWeekError } = await supabase
        .from("pa_daily_state")
        .select("drank_ml")
        .eq("user_id", user.id)
        .eq("date_key", lastWeekKey)
        .maybeSingle();

      if (lastWeekError) {
        console.error("[Hydration] last week error:", lastWeekError);
      }

      if (mounted) {
        setLastWeekAmount(lastWeekRow?.drank_ml ?? 0);
      }

      channel = supabase
        .channel(`pa_daily_state_hydration_${user.id}_${todayKey}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pa_daily_state",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const row = payload.new as DailyStateRow | null;
            if (!row?.date_key || row.date_key !== todayKey) return;

            setHydrationState((prev) => {
              const next = normalizeHydration(row, todayKey, prev.weightKg);
              latestHydrationRef.current = next;
              return next;
            });
          }
        )
        .subscribe();

      if (mounted) setIsLoaded(true);
    };

    void loadHydration();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user?.id ?? null;
      setUserId(nextUserId);
      userIdRef.current = nextUserId;
    });

    const flushOnLeave = () => {
      void saveHydration(latestHydrationRef.current, userIdRef.current);
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
  }, [todayKey, saveHydration]);

  const scheduleSave = useCallback(
    (next: HydrationData) => {
      latestHydrationRef.current = next;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        void saveHydration(next);
      }, 150);
    },
    [saveHydration]
  );

  const setHydration = useCallback(
    (updater: HydrationData | ((prev: HydrationData) => HydrationData)) => {
      setHydrationState((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (prev: HydrationData) => HydrationData)(prev)
            : updater;

        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const baseGoalMl = useMemo(
    () => hydration.weightKg * 35,
    [hydration.weightKg]
  );
  const extraMl = isLodos ? 300 : 0;
  const goalMl = baseGoalMl + extraMl;

  return {
    hydration,
    setHydration,
    goalMl,
    baseGoalMl,
    extraMl,
    lastWeekAmount,
    userId,
    isLoaded,
  };
}