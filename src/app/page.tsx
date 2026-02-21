import Link from "next/link";
import { ArrowRight, BookOpen, Share2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 py-20">
        <div className="inline-block px-4 py-1.5 bg-pastel-yellow rounded-full text-xs font-black uppercase tracking-widest shadow-sm rotate-2">
          Study smarter, not harder 🧠
        </div>
        <h1 className="heading-xl">
          Gaskeun <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-purple via-pastel-pink to-pastel-blue">
            Belajar Bareng!
          </span>
        </h1>
        <p className="max-w-2xl text-xl md:text-2xl font-medium opacity-80 leading-relaxed">
          Platform paling sat-set buat lu yang mau bagi-bagi materi atau nyari rangkuman paling legit.
          No cap, belajar bareng jadi makin asik dan estetik! 💅✨
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link href="/explore" className="btn-pastel bg-black text-white hover:bg-pastel-blue hover:text-black flex items-center gap-2">
            Mulai Explore <ArrowRight size={20} />
          </Link>
          <Link href="/upload" className="btn-pastel bg-pastel-pink text-black flex items-center gap-2">
            Upload Materi <Share2 size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-20">
        <div className="card-pastel bg-pastel-blue/20 hover:-rotate-2">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <BookOpen className="text-pastel-blue" />
          </div>
          <h3 className="text-2xl font-black mb-2">Materi Lengkap</h3>
          <p className="font-medium opacity-70">Cari materi apa aja dari kampus mana aja. Semua ada di sini!</p>
        </div>
        <div className="card-pastel bg-pastel-purple/20 hover:rotate-1">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Zap className="text-pastel-purple" />
          </div>
          <h3 className="text-2xl font-black mb-2">Cepet & Ringan</h3>
          <p className="font-medium opacity-70">Akses PDF kilat tanpa ribet. Sat set langsung dapet!</p>
        </div>
        <div className="card-pastel bg-pastel-pink/20 hover:-rotate-1">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Share2 className="text-pastel-pink" />
          </div>
          <h3 className="text-2xl font-black mb-2">Anonim Boleh</h3>
          <p className="font-medium opacity-70">Mau bagi materi tapi malu? Tenang, bisa anonim kok. Slay!</p>
        </div>
      </section>
    </div>
  );
}
