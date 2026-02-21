# Panduan Setup MahaShare (Full Web Dashboard) - SOLUSI ERROR 404

Masalah 404 terjadi karena Cloudflare salah membaca folder output. Ikuti settingan **PERSIS** seperti di bawah ini:

## 1. Buat Database (D1)
1. Login ke Dashboard Cloudflare.
2. Klik menu **Workers & Pages** -> **D1**.
3. Klik **Create database** -> **Dashboard**.
4. Kasih nama: `mahasiswa-db`. Klik **Create**.
5. Klik tab **Console**, copy-paste SQL di bawah, terus **Execute**:

```sql
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, username TEXT NOT NULL UNIQUE, name TEXT, avatar TEXT, created_at INTEGER DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE materials (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, file_key TEXT NOT NULL, category TEXT, user_id TEXT, is_anonymous INTEGER DEFAULT 0, upvotes_count INTEGER DEFAULT 0, created_at INTEGER DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE comments (id TEXT PRIMARY KEY, material_id TEXT NOT NULL, user_id TEXT, content TEXT NOT NULL, created_at INTEGER DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE upvotes (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, material_id TEXT NOT NULL);
```

## 2. Buat Storage (R2)
1. Klik menu **Workers & Pages** -> **R2**.
2. Klik **Create bucket**.
3. Kasih nama: `mahasiswa-materi`. Klik **Create**.

## 3. Deploy Project (PENTING!)
1. Klik menu **Workers & Pages** -> **Pages**.
2. Klik **Connect to Git** dan pilih repo lu.
3. Di bagian **Build settings**, setting **WAJIB** begini:
   - **Framework preset:** Pilih `None`.
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output/static`  <-- (TAMBAHKAN /static DI BELAKANGNYA)
4. Di bagian **Environment variables**, tambahkan:
   - **Variable name:** `NODE_VERSION`, **Value:** `20`
5. Klik **Save and Deploy**.

## 4. Hubungkan Binding & Flags
Setelah deploy (walaupun gagal), masuk ke **Settings** project Pages lu:
1. **Functions -> Compatibility flags:**
   - Production compatibility date: `2024-11-01`
   - Production compatibility flags: tambahkan `nodejs_compat`.
2. **Functions -> D1 database bindings:** Tambah binding `DB` ke `mahasiswa-db`.
3. **Functions -> R2 bucket bindings:** Tambah binding `BUCKET` ke `mahasiswa-materi`.
4. **Klik Save.**

## 5. Re-deploy
1. Pergi ke tab **Deployments**.
2. Klik **Retry deployment** pada deployment terakhir.

**Kenapa 404?** Karena tanpa `/static` di belakang `.vercel/output`, Cloudflare tidak bisa menemukan file utama website lu. Pastikan settingan nomor 3 sudah benar!

Gaskeun! 🚀✨

---

## ⚠️ Security Note (MVP)

Proyek ini adalah **Minimum Viable Product (MVP)**. Beberapa catatan penting:
- **Authentication:** Menggunakan sistem mock login sederhana dengan cookie yang tidak ter-enkripsi. Untuk penggunaan produksi yang aman, sangat disarankan menggunakan library seperti **Auth.js (NextAuth)**, **Clerk**, atau **Kinde**, serta menggunakan hashing password yang benar (seperti bcrypt/argon2).
- **R2 Storage:** Pastikan settingan CORS di bucket R2 lu sudah mengizinkan domain website lu agar PDF bisa didownload/ditampilkan dengan benar.
- **D1 Database:** Selalu backup database lu sebelum melakukan perubahan schema manual lewat SQL.
