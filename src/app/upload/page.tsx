"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, File, X, Info, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const runtime = 'edge';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnon, setIsAnon] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lainnya");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const categories = ["Teknik", "Ekonomi", "Hukum", "Kedokteran", "Sospol", "MIPA", "Lainnya"];

  const handleUpload = async () => {
    if (!file || !title) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isAnonymous", String(isAnon));

      const res = await fetch("/api/material/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json() as any;
        router.push(`/material/${data.id}`);
        router.refresh();
      } else {
        alert("Waduh, gagal upload nih. Coba lagi ya!");
      }
    } catch (e) {
      console.error(e);
      alert("Error pas upload. Cek koneksi lu!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="heading-lg mb-8 italic">
        Bagi Materi, <br />
        <span className="text-pastel-blue">Dapet Pahala ✨</span>
      </h1>

      <div className="grid gap-10">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Judul Materi</label>
            <Input
              placeholder="Misal: Rangkuman Alpro Semester 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2 flex items-center gap-1">
              <AlignLeft size={12} /> Deskripsi Materi
            </label>
            <textarea
              className="flex min-h-[100px] w-full rounded-2xl border-2 border-black/5 bg-white/50 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 transition-all"
              placeholder="Jelasin dikit dong materi ini tentang apa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">Kategori / Jurusan</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 font-bold text-sm transition-all",
                    category === cat
                      ? "border-black bg-black text-white"
                      : "border-black/5 hover:border-pastel-purple hover:bg-pastel-purple/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest px-2">File PDF Lu</label>
            <div
              className="border-4 border-dashed border-black/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-pastel-blue transition-all bg-white/30"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile?.type === "application/pdf") {
                  setFile(droppedFile);
                }
              }}
            >
              {!file ? (
                <>
                  <div className="w-16 h-16 bg-pastel-blue/20 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="text-pastel-blue" size={32} />
                  </div>
                  <p className="font-bold mb-2 text-lg">Seret PDF lu ke sini</p>
                  <p className="text-sm opacity-50 font-medium">Atau klik buat nyari file</p>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload" className="mt-6 btn-pastel bg-black text-white cursor-pointer">
                    Pilih File
                  </label>
                </>
              ) : (
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border-2 border-black/5">
                  <div className="w-12 h-12 bg-pastel-green/20 rounded-xl flex items-center justify-center">
                    <File className="text-pastel-green" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[10px] opacity-50 uppercase font-black">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 rounded-full text-red-400">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-pastel-yellow/20 rounded-2xl border-2 border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Info className="text-pastel-yellow" size={20} />
              </div>
              <div>
                <p className="font-black text-sm">Upload sebagai Anonim?</p>
                <p className="text-xs opacity-60 font-bold">Nama lu nggak bakal kelihatan</p>
              </div>
            </div>
            <button
              onClick={() => setIsAnon(!isAnon)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative border-2 border-black/10",
                isAnon ? "bg-black" : "bg-white"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full transition-all",
                isAnon ? "right-1 bg-white" : "left-1 bg-black"
              )} />
            </button>
          </div>

          <Button
            variant="primary"
            className="py-4 text-xl mt-4"
            disabled={!file || !title || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? "Lagi di-upload..." : "Publish Materi 🚀"}
          </Button>
        </section>
      </div>
    </div>
  );
}
