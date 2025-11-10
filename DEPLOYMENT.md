# Deployment Guide - Jobify

Panduan lengkap untuk mendeploy aplikasi Jobify ke Vercel.

## Persiapan Deployment

### 1. Pastikan Build Berhasil

Sebelum deploy, pastikan aplikasi bisa di-build dengan sukses:

```bash
npm run build
```

Jika build berhasil, Anda akan melihat output seperti:
```
✓ Compiled successfully
✓ Generating static pages (14/14)
```

### 2. Push ke GitHub (Recommended)

Jika belum, buat repository GitHub dan push code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

## Metode Deployment

### Metode 1: Deploy via Vercel Dashboard (Paling Mudah)

1. **Buka [vercel.com](https://vercel.com)**
   - Buat akun jika belum punya (bisa login dengan GitHub)

2. **Klik "Add New Project"**

3. **Import Repository**
   - Pilih repository GitHub Anda
   - Atau upload folder project langsung

4. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build dan deploy selesai
   - Aplikasi akan otomatis tersedia di URL yang diberikan

### Metode 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```
   - Akan membuka browser untuk autentikasi

3. **Deploy ke Preview**
   ```bash
   vercel
   ```
   - Ikuti instruksi yang muncul
   - Pilih scope (personal/team)
   - Link to existing project atau create new

4. **Deploy ke Production**
   ```bash
   vercel --prod
   ```

### Metode 3: GitHub Integration (Automatic Deployment)

1. **Push Code ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect GitHub ke Vercel**
   - Login ke Vercel
   - Go to Dashboard > Settings > Git
   - Connect GitHub account
   - Authorize Vercel

3. **Import Project**
   - Klik "Add New Project"
   - Pilih repository
   - Configure settings
   - Deploy

4. **Automatic Deployment**
   - Setiap push ke `main` branch akan auto-deploy ke production
   - Push ke branch lain akan create preview deployment

## Konfigurasi Vercel

File `vercel.json` sudah dikonfigurasi dengan:
- Framework: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`
- Region: Singapore (sin1) untuk performa lebih baik di Asia

## Environment Variables

Aplikasi ini **tidak memerlukan environment variables** karena menggunakan:
- Client-side localStorage untuk data storage
- Tidak ada backend API
- Semua fungsi bekerja di client-side

## Setelah Deployment

### 1. Cek Deployment
- Buka URL yang diberikan Vercel
- Test semua fitur aplikasi
- Pastikan semua halaman bisa diakses

### 2. Custom Domain (Opsional)
- Go to Project Settings > Domains
- Add custom domain
- Follow instruksi untuk setup DNS

### 3. Monitoring
- Vercel Dashboard menyediakan analytics
- Monitor performance dan errors
- Check deployment logs jika ada masalah

## Troubleshooting

### Build Fails
1. Pastikan semua dependencies terinstall: `npm install`
2. Check error di build logs
3. Pastikan Node.js version compatible (18+)

### Runtime Errors
1. Check browser console untuk errors
2. Pastikan semua file assets ter-upload
3. Check Vercel function logs

### Image Not Loading
1. Pastikan file logo ada di `public/assets/`
2. Check path image di code
3. Pastikan file size tidak terlalu besar

## Performance Tips

1. **Image Optimization**
   - Next.js Image component sudah optimize otomatis
   - Pastikan image size tidak terlalu besar

2. **Code Splitting**
   - Next.js sudah melakukan code splitting otomatis
   - Check bundle size di build output

3. **Caching**
   - Vercel sudah setup caching otomatis
   - Static pages akan di-cache

## Support

Jika ada masalah saat deployment:
1. Check Vercel documentation: https://vercel.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Check build logs di Vercel Dashboard

## Next Steps

Setelah deployment berhasil:
1. Share URL aplikasi
2. Test semua fitur di production
3. Monitor performance
4. Setup custom domain (opsional)
5. Enable analytics (opsional)

---

**Selamat! Aplikasi Jobify Anda sudah live! 🎉**

