"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-10 text-neutral-800">
      <div className="mx-auto max-w-md rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
        <h1 className="text-3xl font-light tracking-tight">Ceren’s PA</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Devam etmek için giriş yap.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-600">Email</label>
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
            <label className="mb-1 block text-sm text-neutral-600">Şifre</label>
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
            disabled={loading}
            className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
      </div>
    </main>
  );
}