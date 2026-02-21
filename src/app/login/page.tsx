import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const runtime = 'edge';

export default function LoginPage() {
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

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Email Lu</label>
            <Input type="email" placeholder="example@gmail.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Password</label>
            <Input type="password" placeholder="Ssttt... rahasia" />
          </div>
          <Button className="mt-4 py-4 text-lg">Login Gaskeun!</Button>
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
