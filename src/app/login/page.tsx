"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const runtime = 'edge';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        alert("Login gagal, coba lagi!");
      }
    } catch (e) {
      alert("Error pas login!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="card-pastel bg-white flex flex-col gap-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pastel-pink rounded-3xl mb-6 rotate-12">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 italic">Welcome Back!</h1>
          <p className="font-bold opacity-60 italic text-sm">Siap buat bagi-bagi materi lagi? 🔥</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Email Lu</label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Password</label>
            <Input
              type="password"
              placeholder="Ssttt... rahasia"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="mt-4 py-4 text-lg" disabled={isLoading}>
            {isLoading ? "Bentar..." : "Login Gaskeun!"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm font-bold opacity-60">
            Belum punya akun?{" "}
            <Link href="/register" className="text-pastel-purple hover:underline underline-offset-4">
              Daftar dulu lah!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
