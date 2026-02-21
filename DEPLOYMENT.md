# Panduan Deployment MahaShare ke Cloudflare Pages

MahaShare dirancang untuk berjalan secara optimal di ekosistem Cloudflare. Ikuti langkah-langkah di bawah ini untuk menghubungkan dan men-deploy project ini.

## 1. Persiapan Database (Cloudflare D1)

Buka dashboard Cloudflare atau gunakan Wrangler CLI untuk membuat database D1:

```bash
npx wrangler d1 create mahasiswa-db
```

Salin `database_id` yang muncul dan masukkan ke dalam file `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mahasiswa-db"
database_id = "MASUKKAN-ID-DATABASE-LU-DI-SINI"
```

Inisialisasi tabel database (local):
```bash
npx drizzle-kit push
```

## 2. Persiapan Storage (Cloudflare R2)

Buat bucket R2 untuk menyimpan file PDF:

```bash
npx wrangler r2 bucket create mahasiswa-materi
```

Pastikan nama bucket di `wrangler.toml` sudah sesuai:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "mahasiswa-materi"
```

## 3. Deployment ke Cloudflare Pages

### Melalui CLI (Wrangler):

1. **Build project:**
   ```bash
   npm run pages:build
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

### Melalui Dashboard Cloudflare (GitHub Integration):

1. Push code lu ke GitHub repository.
2. Di Dashboard Cloudflare, buka **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Pilih repository `mahasiswa-share`.
4. Gunakan settingan berikut:
   - **Framework preset:** `Next.js`
   - **Build command:** `npm run pages:build`
   - **Build output directory:** `.vercel/output`
5. Di bagian **Environment Variables**, pastikan **Compatibility Flag** memiliki `nodejs_compat`.
6. Di bagian **Bindings**, hubungkan:
   - **D1 Database Binding:** Nama: `DB`, Database: `mahasiswa-db`
   - **R2 Bucket Binding:** Nama: `BUCKET`, Bucket: `mahasiswa-materi`

## 4. Gaskeun! 🚀

Setelah proses deploy selesai, website lu bakal langsung online. Lu bisa cek log di dashboard Cloudflare kalau ada error pas build.

**Notes:**
- Pastikan lu pake Node.js versi terbaru (v18 ke atas).
- Kalau mau testing local tapi dapet data asli dari D1, pake `wrangler pages dev`.
