"use client";

import { useStickyNote } from "../hooks/useStickyNote";

export default function StickyNoteCard() {
  const { note, setNote, clearNote } = useStickyNote();

  return (
    <div className="rounded-3xl bg-white/30 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-base font-medium">Not</h2>

        {note && (
          <button
            onClick={clearNote}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        )}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Bugün için not yaz..."
        className="mt-4 w-full resize-none rounded-2xl bg-white/40 p-3 text-sm outline-none ring-1 ring-black/5"
        rows={4}
      />
    </div>
  );
}