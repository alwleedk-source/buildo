# 📘 دليل إكمال تحويل المشروع

> **هذا الدليل يشرح كيفية إكمال تحويل المشروع من React SPA إلى Next.js SSR**

---

## 🎯 الهدف

إكمال تحويل **45 صفحة** و **~50 API route** من المشروع القديم إلى Next.js.

---

## 📊 الحالة الحالية

### ✅ ما تم إنجازه (15%)
- إعداد Next.js مع TypeScript و Tailwind
- إعداد Database (Drizzle ORM + PostgreSQL)
- إعداد Authentication (JWT)
- تحويل 5 API routes:
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/user
  - GET /api/hero
  - GET /api/services

### 🔄 ما يجب إكماله (85%)
- ~45 API route متبقية
- 45 صفحة
- ~30 component
- Email system
- File uploads
- Auto backups

---

## 🗺️ خطة الإكمال

### المرحلة 1: إكمال API Routes (أولوية عالية)

#### 1.1 Content APIs (Public)
```bash
# يجب تحويل:
GET /api/services/[slug]
GET /api/statistics
GET /api/about
GET /api/projects
GET /api/projects/[id]
GET /api/blog
GET /api/blog/[slug]
GET /api/team
GET /api/testimonials
GET /api/partners
POST /api/contact
```

**مثال**: تحويل `/api/services/[slug]`

```typescript
// src/app/api/services/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const service = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);
    
    if (service.length === 0) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service[0]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
```

#### 1.2 Admin APIs (Protected)
```bash
# يجب تحويل مع المصادقة:
PUT /api/admin/hero
GET /api/admin/statistics
POST /api/admin/statistics
PUT /api/admin/statistics/[id]
DELETE /api/admin/statistics/[id]
# ... وهكذا لكل جدول
```

**مثال**: تحويل `POST /api/admin/services`

```typescript
// src/app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();
    
    const data = await request.json();
    const [newService] = await db.insert(services).values(data).returning();
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create service' },
      { status: 500 }
    );
  }
}
```

---

### المرحلة 2: تحويل الصفحات

#### 2.1 Public Pages

**مثال**: تحويل صفحة Home

```typescript
// src/app/page.tsx
import { db } from '@/lib/db';
import { heroContent, services, projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function HomePage() {
  // Fetch data on server
  const hero = await db
    .select()
    .from(heroContent)
    .where(eq(heroContent.isActive, true))
    .limit(1);
  
  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.isActive, true));
  
  return (
    <main>
      <HeroSection data={hero[0]} />
      <ServicesSection services={allServices} />
      {/* ... */}
    </main>
  );
}

// Add metadata for SEO
export const metadata = {
  title: 'BouwMeesters Amsterdam BV - Professional Construction',
  description: 'Leading construction company in Amsterdam...',
  openGraph: {
    title: 'BouwMeesters Amsterdam BV',
    description: 'Professional construction services',
    images: ['/og-image.jpg'],
  },
};
```

#### 2.2 Admin Pages

**مثال**: تحويل Admin Dashboard

```typescript
// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminDashboard() {
  // Check authentication
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  
  // Fetch dashboard data
  const stats = await db.select().from(statistics);
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

---

### المرحلة 3: تحويل Components

#### نسخ Components من المشروع القديم

```bash
# نسخ جميع components
cp -r /home/ubuntu/buildo/client/src/components/* /home/ubuntu/buildo-nextjs/src/components/
```

#### تعديل imports

```typescript
// قبل (React SPA)
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

// بعد (Next.js)
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
```

#### تحويل Client Components

```typescript
// إضافة 'use client' للمكونات التفاعلية
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // ...
}
```

---

### المرحلة 4: Features الإضافية

#### 4.1 Email System

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...options,
  });
}
```

#### 4.2 File Uploads

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { message: 'No file uploaded' },
      { status: 400 }
    );
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const path = join(process.cwd(), 'public/uploads', file.name);
  await writeFile(path, buffer);
  
  return NextResponse.json({ 
    url: `/uploads/${file.name}` 
  });
}
```

---

## 📝 Checklist للإكمال

### API Routes
- [ ] Content APIs (10 routes)
- [ ] Admin APIs (35+ routes)
- [ ] Upload API
- [ ] Email API

### Pages
- [ ] Public Pages (15 pages)
- [ ] Admin Pages (30 pages)

### Components
- [ ] نسخ جميع Components
- [ ] تعديل imports
- [ ] إضافة 'use client' حيث لزم

### Features
- [ ] Email System
- [ ] File Uploads
- [ ] Auto Backups
- [ ] Sitemap

### Testing
- [ ] اختبار جميع APIs
- [ ] اختبار جميع الصفحات
- [ ] اختبار Authentication
- [ ] اختبار Forms

### Deployment
- [ ] إعداد Railway
- [ ] إضافة Environment Variables
- [ ] Deploy
- [ ] Test في Production

---

## ⏱️ الوقت المتوقع

- **API Routes**: 6-8 ساعات
- **Pages**: 8-10 ساعات
- **Components**: 4-6 ساعات
- **Features**: 4-6 ساعات
- **Testing**: 2-4 ساعات

**إجمالي**: 24-34 ساعة (3-4 أيام عمل)

---

## 💡 نصائح

1. **ابدأ بـ API Routes** - الأهم للصفحات
2. **استخدم Copilot/ChatGPT** - للتسريع
3. **اختبر باستمرار** - لا تنتظر النهاية
4. **اتبع النمط** - استخدم الأمثلة الموجودة
5. **وثّق التغييرات** - حدّث CONVERSION_PROGRESS.md

---

## 🆘 المساعدة

إذا واجهت مشاكل:
1. راجع `API_CONVERSION_GUIDE.md`
2. راجع Next.js docs: https://nextjs.org/docs
3. راجع Drizzle docs: https://orm.drizzle.team

---

**حظاً موفقاً في إكمال التحويل! 🚀**
