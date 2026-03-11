"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cerenspa:sticky-note:v1";

export function useStickyNote() {
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNote(saved);
      }
    } catch {
      // sessiz geç
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, note);
    } catch {
      // sessiz geç
    }
  }, [note]);

  const clearNote = () => {
    setNote("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    note,
    setNote,
    clearNote,
  };
}