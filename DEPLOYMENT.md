# Panduan Setup MahaShare (Full Web Dashboard)

Kalau lu nggak mau ribet pake terminal/coding di laptop sendiri, lu bisa setup semuanya langsung dari browser di Dashboard Cloudflare. Ikuti langkah-langkah ini:

## 1. Buat Database (D1)
1. Login ke Dashboard Cloudflare.
2. Klik menu **Workers & Pages** -> **D1**.
3. Klik **Create database** -> **Dashboard**.
4. Kasih nama: `mahasiswa-db`. Klik **Create**.
5. Setelah jadi, klik tab **Console**.
6. Copy-paste kode SQL di bawah ini ke console buat bikin tabelnya, terus klik **Execute**:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar TEXT,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_key TEXT NOT NULL,
  category TEXT,
  user_id TEXT,
  is_anonymous INTEGER DEFAULT 0,
  upvotes_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  user_id TEXT,
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE upvotes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (material_id) REFERENCES materials(id)
);
```

## 2. Buat Storage (R2)
1. Klik menu **Workers & Pages** -> **R2**.
2. Klik **Create bucket**.
3. Kasih nama: `mahasiswa-materi`. Klik **Create**.

## 3. Deploy Project ke Pages
1. Klik menu **Workers & Pages** -> **Pages**.
2. Klik **Connect to Git**.
3. Pilih repository GitHub lu (pastiin project ini udah lu push ke GitHub).
4. Klik **Begin setup**.
5. Di bagian **Build settings**:
   - **Framework preset:** Pilih `None` (Jangan pilih Next.js bawaan).
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output`
6. Di bagian **Environment variables (Advanced)**, lu **WAJIB** tambahin ini:
   - **Variable name:** `NODE_VERSION`, **Value:** `20`
7. Klik **Save and Deploy**. (Awalnya bakal gagal sebentar, lanjut ke step bawah).

## 4. Hubungkan Database & Storage (PENTING!)
Setelah deploy pertama jalan, lu harus konekin database-nya:
1. Masuk ke project Pages lu tadi di dashboard.
2. Klik tab **Settings** -> **Functions**.
3. Scroll ke bawah sampai ketemu **D1 database bindings**. Klik **Add binding**.
   - **Variable name:** `DB`
   - **D1 database:** Pilih `mahasiswa-db`.
4. Scroll lagi ke bawah sampai ketemu **R2 bucket bindings**. Klik **Add binding**.
   - **Variable name:** `BUCKET`
   - **R2 bucket:** Pilih `mahasiswa-materi`.
5. Scroll ke **Compatibility flags**. Klik **Configure flags**.
   - Di bagian **Production**, tambahin flag: `nodejs_compat`.
   - Di bagian **Production**, set **Compatibility date** ke: `2024-11-01` atau yang paling baru.
6. Klik **Save**.

## 5. Re-deploy
1. Klik tab **Deployments**.
2. Klik tombol tiga titik di deployment yang tadi, terus pilih **Retry deployment**.
3. **Selesai!** Website lu sekarang udah online. 🚀

## Tips Kalau Error 404
Kalau lu buka URL-nya terus muncul **404 Not Found**:
1. Pastikan **Build Output Directory** di set ke `.vercel/output` (pake titik di depan).
2. Pastikan **Framework Preset** di set ke `None`.
3. Pastikan **NODE_VERSION** sudah di set ke `20` di Environment Variables.
4. Coba cek log di **Deployments** apakah build-nya beneran sukses atau ada error.

Gampang banget kan? No cap, IPK auto naik! ✨
