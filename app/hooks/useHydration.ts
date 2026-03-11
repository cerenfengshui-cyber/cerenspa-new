"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type HydrationData = {
  dateKey: string;
  drankMl: number;
  weightKg: number;
};

type HydrationHistory = Record<string, { drankMl: number }>;

function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateKeyDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const STORAGE_KEY = "cerenspa:hydration:v1";
const HISTORY_KEY = "cerenspa:hydration:history:v1";
const PA_STATE_ID = "ceren";

type PAStateRow = {
  hydration?: HydrationData;
  hydrationHistory?: HydrationHistory;
};

export function useHydration(isLodos: boolean = false) {
  const [hydration, setHydration] = useState<HydrationData>({
    dateKey: getTodayKey(),
    drankMl: 0,
    weightKg: 60,
  });

  const [lastWeekAmount, setLastWeekAmount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHydration() {
      const today = getTodayKey();

      try {
        const { data, error } = await supabase
          .from("pa_state")
          .select("state")
          .eq("id", PA_STATE_ID)
          .single();

        if (!error && data?.state && !cancelled) {
          const state = data.state as PAStateRow;
          const savedHydration = state.hydration;
          const savedHistory = state.hydrationHistory ?? {};

          if (savedHydration) {
            if (savedHydration.dateKey === today) {
              setHydration({
                dateKey: today,
                drankMl: savedHydration.drankMl ?? 0,
                weightKg: savedHydration.weightKg ?? 60,
              });
            } else {
              setHydration({
                dateKey: today,
                drankMl: 0,
                weightKg: savedHydration.weightKg ?? 60,
              });
            }
          }

          const lastWeekKey = getDateKeyDaysAgo(7);
          setLastWeekAmount(savedHistory[lastWeekKey]?.drankMl ?? 0);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              savedHydration && savedHydration.dateKey === today
                ? {
                    dateKey: today,
                    drankMl: savedHydration.drankMl ?? 0,
                    weightKg: savedHydration.weightKg ?? 60,
                  }
                : {
                    dateKey: today,
                    drankMl: 0,
                    weightKg: savedHydration?.weightKg ?? 60,
                  }
            )
          );
          localStorage.setItem(HISTORY_KEY, JSON.stringify(savedHistory));
          setIsLoaded(true);
          return;
        }
      } catch {
        // Supabase okunamazsa localStorage fallback
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as HydrationData;

          if (parsed.dateKey === today) {
            setHydration({
              dateKey: today,
              drankMl: parsed.drankMl ?? 0,
              weightKg: parsed.weightKg ?? 60,
            });
          } else {
            setHydration({
              dateKey: today,
              drankMl: 0,
              weightKg: parsed.weightKg ?? 60,
            });
          }
        }

        const historyRaw = localStorage.getItem(HISTORY_KEY);
        const history: HydrationHistory = historyRaw ? JSON.parse(historyRaw) : {};
        const lastWeekKey = getDateKeyDaysAgo(7);
        setLastWeekAmount(history[lastWeekKey]?.drankMl ?? 0);
      } catch {
        // sessiz geç
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    }

    loadHydration();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    async function saveHydration() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hydration));

        const historyRaw = localStorage.getItem(HISTORY_KEY);
        const history: HydrationHistory = historyRaw ? JSON.parse(historyRaw) : {};

        history[hydration.dateKey] = {
          drankMl: hydration.drankMl,
        };

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

        const lastWeekKey = getDateKeyDaysAgo(7);
        setLastWeekAmount(history[lastWeekKey]?.drankMl ?? 0);

        const stateToSave: PAStateRow = {
          hydration,
          hydrationHistory: history,
        };

        await supabase.from("pa_state").upsert(
          {
            id: PA_STATE_ID,
            state: stateToSave,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch {
        // sessiz geç
      }
    }

    saveHydration();
  }, [hydration, isLoaded]);

  const baseGoalMl = useMemo(() => {
    return hydration.weightKg * 35;
  }, [hydration.weightKg]);

  const extraMl = isLodos ? 300 : 0;
  const goalMl = baseGoalMl + extraMl;

  return {
    hydration,
    setHydration,
    goalMl,
    baseGoalMl,
    extraMl,
    lastWeekAmount,
  };
}