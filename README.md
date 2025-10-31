# 🏗️ BouwMeesters Amsterdam BV - Next.js Version

> **مشروع محول من React SPA + Express إلى Next.js SSR لتحسين SEO والأداء**

---

## ⚠️ حالة المشروع

**المشروع قيد التحويل - غير جاهز للإنتاج**

التقدم الحالي: **~15%** من التحويل الكامل

---

## 🎯 الهدف

تحويل موقع BouwMeesters Amsterdam BV إلى Next.js لتحقيق:
- ✅ **SEO 100%** - Server-Side Rendering
- ✅ **Performance 100%** - Lighthouse Score  
- ✅ **سرعة خارقة** - Core Web Vitals ممتازة
- ✅ **تكلفة أقل** - استضافة أرخص

---

## 📊 المقارنة

| المعيار | React SPA | Next.js SSR |
|---------|-----------|-------------|
| SEO Score | 40-50 | **95-100** |
| Performance | 50-60 | **95-100** |
| Time to Interactive | 5-8s | **< 1s** |
| JavaScript Size | 2-3 MB | **~200 KB** |
| Hosting Cost | $50-100/mo | **$5-10/mo** |

---

## 🚀 البدء السريع

### المتطلبات
- Node.js >= 20.18.0
- PostgreSQL
- npm

### التثبيت

```bash
# 1. تثبيت المتطلبات
npm install

# 2. إعداد قاعدة البيانات
cp .env.example .env.local
# عدّل DATABASE_URL في .env.local

# 3. تطبيق schema
npm run db:push

# 4. تشغيل المشروع
npm run dev
```

---

## 📁 هيكل المشروع

```
buildo-nextjs/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API Routes
│   │   └── ...            # Pages (قيد التحويل)
│   ├── lib/               # Utilities
│   │   ├── db/           # Database
│   │   └── auth.ts       # Authentication
│   └── components/        # Components (قيد التحويل)
├── public/               # Static files
└── package.json
```

---

## 🔧 Scripts

```bash
npm run dev          # Development
npm run build        # Build
npm run start        # Production
npm run db:push      # Apply schema
npm run db:studio    # Database UI
```

---

## 📊 حالة التحويل

راجع `CONVERSION_PROGRESS.md` للتفاصيل الكاملة.

### ✅ مكتمل (~15%)
- Next.js setup
- Database & Schema
- Auth APIs (login, logout, user)
- بعض Content APIs

### 🔄 متبقي (~85%)
- ~45 API route
- 45 صفحة
- ~30 component
- Email system
- File uploads
- Auto backups

---

## 🚂 النشر على Railway

راجع ملف `RAILWAY_DEPLOYMENT.md` (سيتم إنشاؤه لاحقاً).

### المتغيرات المطلوبة
```env
DATABASE_URL=<from-railway>
JWT_SECRET=<random-secret>
ADMIN_EMAIL=admin@buildit-professional.com
ADMIN_PASSWORD=<your-password>
```

---

## 📝 ملاحظات

1. **المشروع غير مكتمل** - يحتاج 2-3 أيام عمل إضافية
2. **الأولوية**: API Routes → Pages → Components
3. **للمساهمة**: راجع `API_CONVERSION_GUIDE.md`

---

**الحالة**: 🔄 قيد التطوير | **التقدم**: 15%
