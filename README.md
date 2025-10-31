# 🏗️ BouwMeesters Amsterdam - Next.js Website

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

موقع ويب احترافي لشركة BouwMeesters Amsterdam للبناء، مبني بتقنيات حديثة مع دعم كامل للغتين الهولندية والإنجليزية.

---

## ✅ حالة المشروع

**المشروع مكتمل 100% وجاهز للنشر!**

### ما تم إنجازه:
- ✅ تحويل كامل من React SPA إلى Next.js 15
- ✅ **31 صفحة** (14 عامة + 17 لوحة تحكم)
- ✅ **112 API route**
- ✅ **108 مكون**
- ✅ نظام i18n كامل (هولندي/إنجليزي)
- ✅ قاعدة بيانات PostgreSQL + Drizzle ORM
- ✅ نظام مصادقة JWT
- ✅ تحسين الأداء: **102 KB** (كان 2-3 MB!)
- ✅ البناء ناجح 100%

---

## ✨ المميزات

### 🌐 متعدد اللغات
- ✅ دعم كامل للهولندية والإنجليزية
- ✅ تبديل سلس بين اللغات
- ✅ حفظ تفضيلات اللغة

### 🎨 واجهة مستخدم حديثة
- ✅ تصميم responsive كامل
- ✅ 47 مكون UI من shadcn/ui
- ✅ Tailwind CSS للتصميم
- ✅ Dark mode support

### ⚡ أداء عالي
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ حجم JavaScript محسّن: **102 KB فقط**
- ✅ Image optimization تلقائي
- ✅ Code splitting

### 🔐 لوحة تحكم كاملة
- ✅ نظام مصادقة JWT آمن
- ✅ إدارة المحتوى الكامل
- ✅ إدارة المشاريع والخدمات
- ✅ إدارة الفريق والشهادات
- ✅ إدارة المدونة
- ✅ نظام رفع الملفات
- ✅ إعدادات متقدمة

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 20.18.0+
- PostgreSQL 15+
- npm أو pnpm

### التثبيت

```bash
# Clone repository
git clone https://github.com/alwleedk-source/buildo.git
cd buildo-nextjs

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npm run db:generate
npm run db:push

# Run development server
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في متصفحك.

---

## 📁 هيكل المشروع

```
buildo-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (pages)/           # Public pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes (112 endpoints)
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components (47)
│   │   ├── pages/            # Page components
│   │   ├── admin/            # Admin components
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utilities
│   │   ├── db/               # Database (Drizzle ORM)
│   │   ├── i18n.ts           # i18n configuration
│   │   └── queryClient.ts    # React Query setup
│   └── hooks/                 # Custom React hooks
├── public/
│   └── locales/              # Translation files
│       ├── nl/               # Dutch translations
│       └── en/               # English translations
└── [config files]
```

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 15.5.6** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Data fetching
- **react-i18next** - Internationalization

### Backend
- **Next.js API Routes** - Backend API
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **Zod** - Validation

### DevOps
- **Railway** - Hosting
- **GitHub** - Version control
- **ESLint** - Code linting

---

## 📖 الصفحات المتاحة

### الصفحات العامة (14)
- `/` - الصفحة الرئيسية
- `/about-us` - من نحن
- `/services` - الخدمات
- `/services/[slug]` - تفاصيل الخدمة
- `/projects` - المشاريع
- `/projects/[id]` - تفاصيل المشروع
- `/blog` - المدونة
- `/blog/[slug]` - مقال المدونة
- `/team` - الفريق
- `/maatschappelijke` - المبادرات المجتمعية
- `/contact` - اتصل بنا
- `/legal/[slug]` - الصفحات القانونية
- `/login` - تسجيل الدخول

### لوحة التحكم (17)
- `/admin` - Dashboard
- `/admin/content` - إدارة المحتوى
- `/admin/projects` - إدارة المشاريع
- `/admin/services` - إدارة الخدمات
- `/admin/blog` - إدارة المدونة
- `/admin/team` - إدارة الفريق
- والمزيد...

---

## 🔧 الأوامر المتاحة

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to database
npm run db:studio       # Open Drizzle Studio
```

---

## 🌍 i18n (التعدد اللغوي)

المشروع يدعم لغتين:
- 🇳🇱 الهولندية (nl) - اللغة الافتراضية
- 🇬🇧 الإنجليزية (en)

### استخدام الترجمات

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.home')}</h1>;
}
```

---

## 🔐 المصادقة

### تسجيل الدخول
```
URL: /login
Email: admin@bouwmeesters.nl
Password: [كما تم تعيينه في ADMIN_PASSWORD]
```

---

## 📊 API Documentation

### Public Endpoints
```
GET  /api/hero                  # Hero content
GET  /api/services              # All services
GET  /api/projects              # All projects
GET  /api/blog                  # All blog articles
POST /api/contact               # Contact form
```

### Admin Endpoints (Protected)
```
PUT    /api/admin/hero          # Update hero
POST   /api/admin/projects      # Create project
PUT    /api/admin/projects/[id] # Update project
... (112 total endpoints)
```

---

## 📈 الأداء

### Lighthouse Scores (Target)
- **Performance:** 95+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

### Bundle Size
- **First Load JS:** 102 KB ✅
- **Page Size:** 2-6 KB per page

---

## 🚀 النشر

راجع [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) للتعليمات الكاملة.

### نشر سريع على Railway:

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Railway
# 3. Add PostgreSQL database
# 4. Set environment variables
# 5. Deploy!
```

---

## 📝 الترخيص

هذا المشروع ملك لـ **BouwMeesters Amsterdam BV**.
جميع الحقوق محفوظة © 2024.

---

## 📞 الاتصال

**BouwMeesters Amsterdam BV**
- Website: [bouwmeesters.nl](https://bouwmeesters.nl)
- Email: info@bouwmeesters.nl
- GitHub: [@alwleedk-source](https://github.com/alwleedk-source)

---

## 📚 الوثائق الإضافية

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - دليل النشر الشامل
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - حالة المشروع التفصيلية

---

**Built with ❤️ using Next.js**

**Happy Coding! 🚀**
