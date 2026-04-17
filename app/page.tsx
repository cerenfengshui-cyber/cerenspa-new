"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import MoonCard from "./components/MoonCard";
import WeatherCard from "./components/WeatherCard";
import StickyNoteCard from "./components/StickyNoteCard";
import MedicationCard from "./components/MedicationCard";
import HydrationCard from "./components/HydrationCard";
import DailyEnergyCard from "./components/DailyEnergyCard";

type AuthState = "loading" | "signed-out" | "signed-in";

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setAuthState(session ? "signed-in" : "signed-out");
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthState(session ? "signed-in" : "signed-out");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    }

    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authState === "loading") {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-2xl font-semibold">Ceren’s PA</h1>
          <p className="text-sm text-neutral-500">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (authState === "signed-out") {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-2xl font-semibold">Ceren’s PA</h1>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p className="mb-4 text-sm text-neutral-500">
              Devam etmek için giriş yap.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-neutral-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-black/10"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-600">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-white px-4 py-3 outline-none ring-1 ring-black/10"
                  placeholder="Şifre"
                  required
                />
              </div>

              {errorMsg ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
              ) : null}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loginLoading ? "Giriş yapılıyor..." : "Giriş yap"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Ceren’s PA</h1>

          <div className="flex items-center gap-2">
            <a
              href="https://ceren-feng-shui-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-neutral-50"
            >
              Feng Shui Lab
            </a>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-white px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-neutral-50"
            >
              Çıkış yap
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid items-stretch gap-4 md:grid-cols-2">
            <MoonCard />
            <StickyNoteCard />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <WeatherCard />
            <HydrationCard />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <MedicationCard />
            </div>

            <div className="md:col-span-1">
              <DailyEnergyCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}