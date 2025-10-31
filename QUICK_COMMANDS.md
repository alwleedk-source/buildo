# ⚡ أوامر سريعة - BouwMeesters Amsterdam

## 🚀 التطوير المحلي

```bash
# تثبيت dependencies
npm install

# تشغيل development server
npm run dev
# الموقع: http://localhost:3000

# بناء للإنتاج
npm run build

# تشغيل production server
npm start

# فحص الأخطاء
npm run lint
```

---

## 🗄️ قاعدة البيانات

```bash
# تطبيق schema على قاعدة البيانات
npx drizzle-kit push

# فتح Drizzle Studio (UI لقاعدة البيانات)
npx drizzle-kit studio

# إنشاء migration جديد
npx drizzle-kit generate
```

### الاتصال بقاعدة البيانات Neon:

```bash
# من terminal
psql 'postgresql://neondb_owner:npg_4EgNnJqeZT1c@ep-damp-rice-aefn32fe-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require'

# أو استخدم DATABASE_URL
DATABASE_URL="postgresql://neondb_owner:npg_4EgNnJqeZT1c@ep-damp-rice-aefn32fe-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require" npx drizzle-kit push
```

---

## 📦 Git Commands

```bash
# التحقق من الحالة
git status

# إضافة جميع التغييرات
git add -A

# عمل commit
git commit -m "Your message"

# رفع إلى GitHub
git push origin main

# سحب آخر التحديثات
git pull origin main
```

---

## 🚂 Railway Deployment

```bash
# بعد النشر على Railway، قم بتشغيل migrations:

# Option 1: من Railway Shell
npx drizzle-kit push

# Option 2: من جهازك (استخدم DATABASE_URL من Railway)
DATABASE_URL="your-railway-database-url" npx drizzle-kit push
```

---

## 🔐 Admin Access

### Local Development:
```
URL: http://localhost:3000/login
Email: admin@bouwmeesters.nl
Password: BouwAdmin2024!
```

### Production:
```
URL: https://your-app.railway.app/login
Email: admin@bouwmeesters.nl
Password: BouwAdmin2024!
```

---

## 🌍 i18n Testing

```bash
# تبديل اللغة في المتصفح:
# انقر على زر NL | EN في الهيدر

# أو استخدم localStorage في Console:
localStorage.setItem('i18nextLng', 'en')  # English
localStorage.setItem('i18nextLng', 'nl')  # Dutch
```

---

## 🧪 Testing URLs

### الصفحات العامة:
```
http://localhost:3000/              # Home
http://localhost:3000/about-us      # About
http://localhost:3000/services      # Services
http://localhost:3000/projects      # Projects
http://localhost:3000/blog          # Blog
http://localhost:3000/team          # Team
http://localhost:3000/contact       # Contact
```

### لوحة التحكم:
```
http://localhost:3000/login         # Login
http://localhost:3000/admin         # Dashboard
http://localhost:3000/admin/content # Content Management
http://localhost:3000/admin/projects # Projects Management
http://localhost:3000/admin/blog    # Blog Management
```

### API Testing:
```bash
# Get hero content
curl http://localhost:3000/api/hero

# Get services
curl http://localhost:3000/api/services

# Get projects
curl http://localhost:3000/api/projects

# Login (get JWT token)
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bouwmeesters.nl","password":"BouwAdmin2024!"}'
```

---

## 📊 Performance Testing

```bash
# استخدم هذه الأدوات بعد النشر:

# 1. Google PageSpeed Insights
https://pagespeed.web.dev/

# 2. GTmetrix
https://gtmetrix.com/

# 3. WebPageTest
https://www.webpagetest.org/
```

---

## 🔧 Troubleshooting

### مشكلة: Port 3000 مستخدم
```bash
# إيقاف العملية على port 3000
lsof -ti:3000 | xargs kill -9

# أو استخدم port آخر
PORT=3001 npm run dev
```

### مشكلة: Database connection error
```bash
# تحقق من DATABASE_URL في .env.local
cat .env.local | grep DATABASE_URL

# اختبر الاتصال
psql "$DATABASE_URL" -c "SELECT 1"
```

### مشكلة: Build يفشل
```bash
# امسح cache وأعد البناء
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### مشكلة: i18n لا يعمل
```bash
# تحقق من ملفات الترجمة
ls -la public/locales/nl/
ls -la public/locales/en/

# امسح cache المتصفح
# أو استخدم Incognito mode
```

---

## 📝 Environment Variables

### Development (.env.local):
```env
DATABASE_URL=postgresql://neondb_owner:npg_4EgNnJqeZT1c@ep-damp-rice-aefn32fe-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=buildo-amsterdam-super-secret-jwt-key-2024-production
ADMIN_EMAIL=admin@bouwmeesters.nl
ADMIN_PASSWORD=BouwAdmin2024!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Railway):
```env
DATABASE_URL=<من Neon أو Railway PostgreSQL>
JWT_SECRET=<مفتاح قوي عشوائي>
ADMIN_EMAIL=admin@bouwmeesters.nl
ADMIN_PASSWORD=<كلمة مرور قوية>
NODE_ENV=production
```

---

## 🎯 Quick Links

- **GitHub:** https://github.com/alwleedk-source/buildo
- **Railway:** https://railway.app/dashboard
- **Neon Console:** https://console.neon.tech/

---

## 📚 الوثائق

- `README.md` - دليل المشروع الرئيسي
- `DEPLOYMENT_GUIDE.md` - دليل النشر الشامل
- `RAILWAY_QUICK_START.md` - دليل النشر السريع
- `PROJECT_STATUS.md` - حالة المشروع
- `COMPLETION_SUMMARY.md` - ملخص الإكمال

---

**Happy Coding! 🚀**
