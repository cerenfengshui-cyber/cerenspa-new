"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const STICKY_USER_ID = "ceren";

export function useStickyNote() {
  const [note, setNote] = useState("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadNote = async () => {
      console.log("[Sticky] load başladı");

      const { data, error } = await supabase
        .from("pa_sticky_notes")
        .select("note_text")
        .eq("user_id", STICKY_USER_ID)
        .maybeSingle();

      console.log("[Sticky] select data:", data);
      console.log("[Sticky] select error:", error);

      if (error) {
        console.error("[Sticky] Not yüklenemedi:", error);
        return;
      }

      if (data?.note_text != null) {
        setNote(data.note_text);
      }

      channel = supabase
        .channel(`pa_sticky_notes_${STICKY_USER_ID}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pa_sticky_notes",
            filter: `user_id=eq.${STICKY_USER_ID}`,
          },
          (payload) => {
            console.log("[Sticky] realtime payload:", payload);

            const newRow = payload.new as { note_text?: string };
            if (typeof newRow?.note_text === "string") {
              setNote(newRow.note_text);
            }
          }
        )
        .subscribe((status) => {
          console.log("[Sticky] realtime status:", status);
        });
    };

    loadNote();

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const saveNote = useCallback(async (value: string) => {
    console.log("[Sticky] saveNote çağrıldı:", value);

    const { data, error } = await supabase
      .from("pa_sticky_notes")
      .upsert(
        {
          user_id: STICKY_USER_ID,
          note_text: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select();

    console.log("[Sticky] upsert data:", data);
    console.log("[Sticky] upsert error:", error);

    if (error) {
      console.error("[Sticky] Not kaydedilemedi:", error);
    }
  }, []);

  const updateNote = useCallback(
    (value: string) => {
      console.log("[Sticky] updateNote:", value);
      setNote(value);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveNote(value);
      }, 300);
    },
    [saveNote]
  );

  const clearNote = useCallback(() => {
    updateNote("");
  }, [updateNote]);

  return {
    note,
    setNote: updateNote,
    clearNote,
  };
}