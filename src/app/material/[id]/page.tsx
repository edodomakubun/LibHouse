import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, ArrowLeft, Lock } from "lucide-react";
import { MaterialInteractions } from "@/components/MaterialInteractions";
import Link from "next/link";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db";
import { materials as materialsTable, comments as commentsTable, users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export const runtime = 'edge';

export default async function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  let material: any;
  let comments: any[] = [];

  try {
    const { env } = getRequestContext();
    const db = getDb(env);

    // Fetch material with owner info
    const materialData = await db
      .select({
        material: materialsTable,
        user: usersTable
      })
      .from(materialsTable)
      .leftJoin(usersTable, eq(materialsTable.userId, usersTable.id))
      .where(eq(materialsTable.id, id))
      .get();

    if (!materialData) return notFound();
    material = {
      ...materialData.material,
      ownerUsername: materialData.user?.username || 'Unknown'
    };

    // Fetch comments with user info
    const commentsData = await db
      .select({
        comment: commentsTable,
        user: usersTable
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .where(eq(commentsTable.materialId, id))
      .all();

    comments = commentsData.map(c => ({
      ...c.comment,
      username: c.user?.username || 'Unknown'
    }));
  } catch (e) {
    console.error("Failed to fetch material detail:", e);
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/explore" className="inline-flex items-center gap-2 font-bold opacity-50 hover:opacity-100 mb-8 transition-opacity">
        <ArrowLeft size={20} /> Kembali Explore
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Material Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Badge variant="blue" className="w-fit">{material.category || "General"}</Badge>
            <h1 className="text-4xl md:text-5xl font-black italic leading-tight">
              {material.title}
            </h1>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-pastel-purple rounded-full flex items-center justify-center font-bold shadow-sm">
                  {material.isAnonymous ? "👤" : "✨"}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Uploaded by</p>
                  <p className="font-bold">{material.isAnonymous ? "Anonim" : `@${material.ownerUsername}`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-pastel bg-white border-black/5 min-h-[400px] flex flex-col items-center justify-center text-center p-12 gap-6">
            <div className="w-20 h-20 bg-pastel-blue/20 rounded-3xl flex items-center justify-center">
              {session ? <Download className="text-pastel-blue" size={40} /> : <Lock className="text-neutral-300" size={40} />}
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 italic">
                {session ? "Siap buat dipelajari?" : "Login buat download!"}
              </h3>
              <p className="font-bold opacity-50">
                {session ? "Klik tombol di bawah buat download file PDF-nya." : "Materi ini terkunci. Lu harus login dulu buat akses filenya."}
              </p>
            </div>
            {session ? (
              <a href={`/api/material/${id}/download`} download>
                <Button variant="primary" className="py-4 px-10 text-lg shadow-xl shadow-black/10">
                  Download PDF
                </Button>
              </a>
            ) : (
              <Link href="/login">
                <Button variant="primary" className="py-4 px-10 text-lg">
                  Login Sekarang
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black italic">Tentang Materi Ini</h3>
            <p className="text-xl font-medium opacity-70 leading-relaxed">
              {material.description || "Gak ada deskripsi nih, pokoknya mantap!"}
            </p>
          </div>
        </div>

        {/* Right: Interaction */}
        <MaterialInteractions
          id={material.id}
          initialUpvotes={material.upvotesCount || 0}
          initialComments={comments}
        />
      </div>
    </div>
  );
}
