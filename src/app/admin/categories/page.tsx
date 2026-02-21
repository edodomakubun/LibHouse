"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Plus, Tag } from "lucide-react";

export const runtime = 'edge';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (Array.isArray(data)) setCategories(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setNewName("");
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus kategori ini?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic mb-2">Manage Kategori</h1>
        <p className="font-bold opacity-50">Atur kategori/jurusan yang tersedia buat mahasiswa. 🏷️</p>
      </div>

      <div className="card-pastel bg-white border-black/5 p-8 max-w-2xl">
        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
          <Input
            placeholder="Nama kategori baru (e.g. Teknik Informatika)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="px-6 flex gap-2" disabled={isLoading}>
            <Plus size={18} /> Tambah
          </Button>
        </form>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-center py-8 font-bold opacity-30 italic">Belum ada kategori nih.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-black/5 hover:border-pastel-purple transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pastel-purple/20 rounded-lg flex items-center justify-center">
                    <Tag className="text-pastel-purple" size={16} />
                  </div>
                  <span className="font-bold">{cat.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
