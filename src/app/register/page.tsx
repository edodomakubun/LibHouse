"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export const runtime = 'edge';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      });
      if (res.ok) {
        alert("Pendaftaran berhasil! Silakan login.");
        router.push("/login");
      } else {
        const data = await res.json() as any;
        alert(data.error || "Pendaftaran gagal, coba lagi!");
      }
    } catch (e) {
      alert("Error pas daftar!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="card-pastel bg-white flex flex-col gap-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pastel-blue rounded-3xl mb-6 -rotate-12">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 italic">Join the Gang!</h1>
          <p className="font-bold opacity-60 italic text-sm">Bikin akun biar bisa bagi-bagi materi 🔥</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Username Lu</label>
            <Input
              type="text"
              placeholder="bocah_ambis"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
              placeholder="Jangan sampe lupa ya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="mt-4 py-4 text-lg bg-pastel-blue hover:bg-black text-white" disabled={isLoading}>
            {isLoading ? "Sabar..." : "Daftar Sekarang!"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm font-bold opacity-60">
            Udah punya akun?{" "}
            <Link href="/login" className="text-pastel-blue hover:underline underline-offset-4">
              Login aja langsung!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
