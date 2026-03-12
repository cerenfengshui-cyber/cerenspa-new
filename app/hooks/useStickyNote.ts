"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useStickyNote() {
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadNote = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User alınamadı:", userError);
        return;
      }

      if (!user) {
        console.warn("Giriş yapan kullanıcı yok.");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("pa_sticky_notes")
        .select("note_text")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Not yüklenemedi:", error);
      } else if (data?.note_text != null) {
        setNote(data.note_text);
      }

      channel = supabase
        .channel(`pa_sticky_notes_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "pa_sticky_notes",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newRow = payload.new as { note_text?: string };
            if (typeof newRow?.note_text === "string") {
              setNote(newRow.note_text);
            }
          }
        )
        .subscribe();
    };

    loadNote();

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const saveNote = useCallback(
    async (value: string) => {
      if (!userId) return;

      const { error } = await supabase.from("pa_sticky_notes").upsert(
        {
          user_id: userId,
          note_text: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("Not kaydedilemedi:", error);
      }
    },
    [userId]
  );

  const updateNote = useCallback(
    (value: string) => {
      setNote(value);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        saveNote(value);
      }, 300);
    },
    [saveNote]
  );

  const clearNote = useCallback(async () => {
    updateNote("");
  }, [updateNote]);

  return {
    note,
    setNote: updateNote,
    clearNote,
  };
}