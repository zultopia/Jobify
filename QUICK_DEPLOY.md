# Quick Deployment Guide - Jobify

## Status
✅ Build berhasil
✅ Git repository initialized
✅ Vercel CLI installed
✅ Logged in to Vercel

## Deploy Sekarang

### Opsi 1: Deploy via CLI (Recommended)

Jalankan command berikut di terminal:

```bash
cd /Users/azulsuhada/Documents/Hackathon
vercel --prod
```

Ikuti instruksi:
1. Set up and deploy? **Y**
2. Which scope? Pilih akun Anda
3. Link to existing project? **N** (untuk project baru)
4. What's your project's name? **jobify** (atau nama lain)
5. In which directory is your code located? **./** (tekan Enter)

Tunggu proses deploy selesai. URL aplikasi akan diberikan setelah deploy berhasil.

### Opsi 2: Deploy via Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Klik "Add New Project"
3. Pilih "Import Git Repository" atau "Upload"
4. Jika upload:
   - Drag and drop folder project
   - Atau pilih folder manual
5. Configure:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Klik "Deploy"

### Opsi 3: Deploy via GitHub (Recommended untuk Continuous Deployment)

1. Buat repository di GitHub
2. Push code:
   ```bash
   git remote add origin https://github.com/your-username/jobify.git
   git branch -M main
   git push -u origin main
   ```
3. Di Vercel Dashboard:
   - Klik "Add New Project"
   - Pilih repository GitHub
   - Configure dan deploy
4. Setiap push ke main branch akan auto-deploy

## Setelah Deploy

1. **Copy URL** yang diberikan Vercel
2. **Test aplikasi** di browser
3. **Share URL** dengan tim/user

## Troubleshooting

### Jika build gagal:
- Pastikan semua dependencies terinstall: `npm install`
- Check error di build logs
- Pastikan Node.js version 18+

### Jika ada error runtime:
- Check browser console
- Check Vercel function logs
- Pastikan semua file assets ter-upload

## Next Steps

Setelah deploy berhasil:
1. Test semua fitur
2. Setup custom domain (opsional)
3. Enable analytics (opsional)
4. Setup GitHub integration untuk auto-deploy

---

**Siap untuk deploy! Jalankan `vercel --prod` untuk mulai deployment.**

