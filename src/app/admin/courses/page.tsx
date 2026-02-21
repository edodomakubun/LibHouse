"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Plus, BookOpen } from "lucide-react";

export const runtime = 'edge';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    if (Array.isArray(data)) setCourses(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify({ name: newName, code: newCode }),
      });
      if (res.ok) {
        setNewName("");
        setNewCode("");
        fetchCourses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus mata kuliah ini?")) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic mb-2">Daftar Mata Kuliah</h1>
        <p className="font-bold opacity-50">Kelola daftar mata kuliah buat tag materi. 📚</p>
      </div>

      <div className="card-pastel bg-white border-black/5 p-8 max-w-3xl">
        <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="Kode MK (e.g. CS101)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <Input
            placeholder="Nama Mata Kuliah"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" className="flex gap-2" disabled={isLoading}>
            <Plus size={18} /> Tambah MK
          </Button>
        </form>

        <div className="grid md:grid-cols-2 gap-4">
          {courses.length === 0 ? (
            <p className="col-span-2 text-center py-8 font-bold opacity-30 italic">Belum ada mata kuliah nih.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-black/5 hover:border-pastel-pink transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pastel-pink/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-pastel-pink" size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block">{course.code || 'NO CODE'}</span>
                    <span className="font-bold">{course.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
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
