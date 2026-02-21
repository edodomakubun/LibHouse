import { Badge } from "@/components/ui/Badge";
import { LayoutDashboard, Users, FileText, MessageCircle } from "lucide-react";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db";
import { users, materials, comments } from "@/db/schema";
import { sql } from "drizzle-orm";

export const runtime = 'edge';

export default async function AdminDashboard() {
  let stats = {
    users: 0,
    materials: 0,
    comments: 0
  };

  try {
    const { env } = getRequestContext();
    const db = getDb(env);

    const uCount = await db.select({ count: sql`count(*)` }).from(users).get() as { count: number };
    const mCount = await db.select({ count: sql`count(*)` }).from(materials).get() as { count: number };
    const cCount = await db.select({ count: sql`count(*)` }).from(comments).get() as { count: number };

    stats = {
      users: uCount.count,
      materials: mCount.count,
      comments: cCount.count
    };
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic mb-2">Dashboard Overview</h1>
        <p className="font-bold opacity-50">Cek perkembangan MahaShare hari ini. 📈</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-pastel bg-white border-black/5 p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-pastel-blue/20 rounded-2xl flex items-center justify-center">
            <Users className="text-pastel-blue" size={24} />
          </div>
          <div>
            <p className="text-4xl font-black">{stats.users}</p>
            <p className="text-sm font-bold opacity-50">Total Mahasiswa</p>
          </div>
        </div>

        <div className="card-pastel bg-white border-black/5 p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-pastel-purple/20 rounded-2xl flex items-center justify-center">
            <FileText className="text-pastel-purple" size={24} />
          </div>
          <div>
            <p className="text-4xl font-black">{stats.materials}</p>
            <p className="text-sm font-bold opacity-50">Materi Terbagi</p>
          </div>
        </div>

        <div className="card-pastel bg-white border-black/5 p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-pastel-pink/20 rounded-2xl flex items-center justify-center">
            <MessageCircle className="text-pastel-pink" size={24} />
          </div>
          <div>
            <p className="text-4xl font-black">{stats.comments}</p>
            <p className="text-sm font-bold opacity-50">Total Komentar</p>
          </div>
        </div>
      </div>

      <div className="card-pastel bg-pastel-yellow/10 border-pastel-yellow/20 p-8">
        <h3 className="text-xl font-black mb-4 italic">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="blue" className="cursor-pointer hover:scale-105 transition-transform">Lihat Semua User</Badge>
          <Badge variant="purple" className="cursor-pointer hover:scale-105 transition-transform">Moderasi Materi</Badge>
          <Badge variant="pink" className="cursor-pointer hover:scale-105 transition-transform">Broadcast Pengumuman</Badge>
        </div>
      </div>
    </div>
  );
}
