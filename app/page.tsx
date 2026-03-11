import MoonCard from "./components/MoonCard";
import WeatherCard from "./components/WeatherCard";
import StickyNoteCard from "./components/StickyNoteCard";
import MedicationCard from "./components/MedicationCard";
import HydrationCard from "./components/HydrationCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-semibold">Ceren’s PA</h1>

        <div className="grid gap-4">
          {/* 1) Moon tam genişlik */}
          <MoonCard />

          {/* 2) Hava + Not yan yana */}
          <div className="grid gap-4 md:grid-cols-2">
            <WeatherCard />
            <StickyNoteCard />
          </div>

          {/* 3) İlaç solda geniş, Su sağda dar */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <MedicationCard />
            </div>

            <div className="md:col-span-1 self-start">
              <HydrationCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}