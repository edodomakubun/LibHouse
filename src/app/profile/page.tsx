import { getSession } from "@/lib/auth/session";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db";
import { materials as materialsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProfileUI } from "@/components/ProfileUI";
import { redirect } from "next/navigation";

export const runtime = 'edge';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  let userMaterials: any[] = [];
  try {
    const { env } = getRequestContext();
    const db = getDb(env);

    userMaterials = await db.select()
      .from(materialsTable)
      .where(eq(materialsTable.userId, session.id))
      .orderBy(desc(materialsTable.createdAt))
      .all();
  } catch (e) {
    console.error("Failed to fetch user materials:", e);
  }

  return <ProfileUI user={session} materials={userMaterials} />;
}
