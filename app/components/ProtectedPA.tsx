"use client";

import { supabase } from "@/lib/supabase";
import MoonCard from "./MoonCard";
import WeatherCard from "./WeatherCard";
import StickyNoteCard from "./StickyNoteCard";
import MedicationCard from "./MedicationCard";
import HydrationCard from "./HydrationCard";

export default function ProtectedPA() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] p-6 text-neutral-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-light tracking-tight">Ceren’s PA</h1>

          <button
            onClick={handleLogout}
            className="rounded-2xl bg-white/70 px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-white"
          >
            Çıkış yap
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <MoonCard />
          </div>

          <WeatherCard />
          <StickyNoteCard />

          <MedicationCard />
          <HydrationCard />
        </div>
      </div>
    </main>
  );
}