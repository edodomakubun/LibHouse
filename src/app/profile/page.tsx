import { Button } from "@/components/ui/Button";
import { User, FileText, Heart, Settings } from "lucide-react";

export const runtime = 'edge';

export default function ProfilePage() {
  // Mock data for UI development
  const user = {
    username: "si_paling_ambis",
    name: "Budi Mahasiswa",
    bio: "Semester 5 Teknik Informatika. Berbagi itu indah, apalagi berbagi jawaban eh materi. ✌️",
    uploads: 12,
    upvotes: 142,
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
              <Button variant="outline" size="sm" className="h-9 px-4">Edit Profile</Button>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full"><Settings size={18} /></Button>
            </div>
          </div>
          <p className="text-xl font-bold mb-2">{user.name}</p>
          <p className="opacity-70 font-medium max-w-lg">{user.bio}</p>

          <div className="flex gap-6 mt-6 justify-center md:justify-start">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-black">{user.uploads}</span>
              <span className="text-xs font-bold uppercase opacity-50">Uploads</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-black">{user.upvotes}</span>
              <span className="text-xs font-bold uppercase opacity-50">Upvotes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black/5 pt-12">
        <div className="flex gap-8 border-b-2 border-black/5 mb-8">
          <button className="pb-4 border-b-4 border-pastel-purple font-black uppercase text-sm tracking-widest">
            My Materials
          </button>
          <button className="pb-4 opacity-30 hover:opacity-100 transition-opacity font-black uppercase text-sm tracking-widest">
            Liked
          </button>
        </div>

        {/* Empty State or List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-black/10 col-span-full">
            <FileText size={48} className="opacity-20 mb-4" />
            <p className="font-bold opacity-50">Belum ada materi yang diupload nih.</p>
            <p className="text-sm opacity-40 mb-6">Gaskeun bagiin ilmu lu sekarang!</p>
            <Button variant="pastel">Upload Pertama Lu</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
