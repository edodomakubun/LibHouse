import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MahaShare - Gaskeun Belajar Bareng!",
  description: "Platform berbagi materi kuliah paling kece buat Gen Z. No cap, IPK auto naik!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-pastel-pink selection:text-black`}
      >
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 md:py-6 bg-white/30 backdrop-blur-md border-b border-black/5">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
            MAHASHARE<span className="text-pastel-purple">.</span>
          </Link>
          <div className="flex gap-3 md:gap-6 items-center font-bold text-sm md:text-base">
            <Link href="/explore" className="hover:text-pastel-blue transition-colors">Explore</Link>
            <Link href="/upload" className="px-3 py-1.5 md:px-4 md:py-2 bg-black text-white rounded-full hover:bg-pastel-purple hover:text-black transition-all">Upload</Link>
            <Link href="/profile" className="hover:text-pastel-pink transition-colors">Profile</Link>
          </div>
        </nav>
        <main className="pt-24 min-h-screen">
          {children}
        </main>
        <footer className="py-10 text-center text-sm opacity-50 font-medium">
          © {new Date().getFullYear()} MahaShare. Made with ✨ for Gen Z.
        </footer>
      </body>
    </html>
  );
}
