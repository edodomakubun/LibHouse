import { Input } from "@/components/ui/Input";
import { MaterialCard } from "@/components/MaterialCard";
import { Search } from "lucide-react";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db";
import { materials as materialsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { cn } from "@/lib/utils";

export const runtime = 'edge';

export default async function ExplorePage() {
  let materials = [];
  try {
    const { env } = getRequestContext();
    const db = getDb(env);
    materials = await db.select().from(materialsTable).orderBy(desc(materialsTable.createdAt)).all();
  } catch (e) {
    console.error("Failed to fetch materials:", e);
    // Fallback to mock data if DB is not ready or in dev without local D1
    materials = [
      { id: "1", title: "Kalkulus Dasar Semester 1", category: "MIPA", userId: "dosen_killer", upvotesCount: 124, isAnonymous: false, createdAt: new Date() },
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h1 className="heading-lg mb-4 italic">Cari Ilmu, <br /><span className="text-pastel-purple">Biar Nggak Gabut 📚</span></h1>
          <p className="font-bold opacity-50">Ada ribuan materi legit yang siap nemenin belajar lu.</p>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
          <Input className="pl-12 h-14 text-lg border-black/10 shadow-sm" placeholder="Cari materi apa aja..." />
        </div>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {["Semua", "Teknik", "Ekonomi", "Hukum", "Kedokteran", "Sospol", "MIPA"].map((cat, i) => (
          <button
            key={cat}
            className={cn(
              "px-6 py-2.5 rounded-full font-black text-sm whitespace-nowrap transition-all border-2",
              i === 0 ? "bg-black text-white border-black" : "bg-white border-black/5 hover:border-pastel-purple"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-20 opacity-40 font-bold italic">
          Belum ada materi nih... Jadilah yang pertama upload! 🚀
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((m) => (
            <MaterialCard
              key={m.id}
              id={m.id}
              title={m.title}
              category={m.category || "General"}
              author={m.userId || "Anonim"}
              upvotes={m.upvotesCount || 0}
              comments={0} // We'd need a join or separate count for real app
              isAnonymous={m.isAnonymous ?? false}
              color={['pink', 'blue', 'purple', 'yellow'][Math.floor(Math.random() * 4)] as any}
            />
          ))}
        </div>
      )}

      <div className="mt-20 text-center">
        <p className="font-bold opacity-30 italic mb-6">Udah mentok nih, no more materials left... 🫡</p>
        <button className="btn-pastel bg-pastel-yellow border-2 border-black/5 font-black uppercase text-xs tracking-widest">
          Load More, Sis!
        </button>
      </div>
    </div>
  );
}
