import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Tag, BookOpen, ArrowLeft } from "lucide-react";

export const runtime = 'edge';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-black italic">Admin Panel</h2>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">MahaShare Control Center</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-pastel-blue/10 hover:text-pastel-blue transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-pastel-purple/10 hover:text-pastel-purple transition-all">
            <Tag size={20} /> Kategori
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold hover:bg-pastel-pink/10 hover:text-pastel-pink transition-all">
            <BookOpen size={20} /> Mata Kuliah
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-black text-white hover:opacity-80 transition-all">
            <ArrowLeft size={20} /> Balik ke Web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
