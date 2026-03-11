"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useStickyNote() {
  const [note, setNote] = useState("");

  // İlk yükleme → Supabase'ten çek
  useEffect(() => {
    const loadNote = async () => {
      const { data } = await supabase
        .from("sticky_notes")
        .select("note")
        .limit(1)
        .single();

      if (data?.note) {
        setNote(data.note);
      }
    };

    loadNote();
  }, []);

  // Note değişince → Supabase'e kaydet
  useEffect(() => {
    const saveNote = async () => {
      await supabase
        .from("sticky_notes")
        .upsert([{ id: "00000000-0000-0000-0000-000000000001", note }]);
    };

    if (note !== undefined) {
      saveNote();
    }
  }, [note]);

  const clearNote = async () => {
    setNote("");

    await supabase
      .from("sticky_notes")
      .upsert([{ id: "00000000-0000-0000-0000-000000000001", note: "" }]);
  };

  return {
    note,
    setNote,
    clearNote,
  };
}