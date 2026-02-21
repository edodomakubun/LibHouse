"use client";

import { Button } from "@/components/ui/Button";
import { FileText, Trash2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface ProfileUIProps {
  user: any;
  materials: any[];
}

export function ProfileUI({ user, materials: initialMaterials }: ProfileUIProps) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Beneran mau hapus materi ini? No cap?")) return;

    try {
      const res = await fetch(`/api/material/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMaterials(materials.filter(m => m.id !== id));
      } else {
        alert("Gagal hapus materi!");
      }
    } catch (e) {
      alert("Error pas hapus!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
        <div className="w-32 h-32 bg-pastel-purple rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white">
          ✨
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-4xl font-black italic">@{user.username}</h1>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
            </div>
          </div>
          <p className="text-xl font-bold mb-2">{user.name || 'Mahasiswa Kece'}</p>
          <p className="opacity-70 font-medium max-w-lg">Berbagi itu indah, apalagi berbagi jawaban eh materi. ✌️</p>

          <div className="flex gap-6 mt-6 justify-center md:justify-start">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-black">{materials.length}</span>
              <span className="text-xs font-bold uppercase opacity-50">Uploads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black/5 pt-12">
        <h2 className="text-2xl font-black italic mb-8">My Materials</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-black/10 col-span-full text-center">
              <FileText size={48} className="opacity-20 mb-4" />
              <p className="font-bold opacity-50">Belum ada materi yang diupload nih.</p>
              <p className="text-sm opacity-40 mb-6">Gaskeun bagiin ilmu lu sekarang!</p>
              <Link href="/upload">
                <Button variant="pastel">Upload Pertama Lu</Button>
              </Link>
            </div>
          ) : (
            materials.map((m) => (
              <div key={m.id} className="card-pastel bg-white border-black/5 flex flex-col gap-4 group">
                <div className="flex justify-between items-start">
                   <div className="px-3 py-1 bg-pastel-blue/20 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {m.category || "General"}
                  </div>
                  <button onClick={() => handleDelete(m.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
                <Link href={`/material/${m.id}`}>
                  <h3 className="text-xl font-extrabold leading-tight hover:text-pastel-purple transition-colors cursor-pointer">{m.title}</h3>
                </Link>
                <p className="text-xs font-bold opacity-40 uppercase">{new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
