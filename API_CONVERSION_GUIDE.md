# 📘 دليل تحويل API من Express إلى Next.js

## نمط التحويل الأساسي

### Express (القديم)
```typescript
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.select().from(servicesTable);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});
```

### Next.js (الجديد)
```typescript
// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';

export async function GET() {
  try {
    const allServices = await db.select().from(services);
    return NextResponse.json(allServices);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
```

---

## API Routes المطلوبة

### Authentication APIs
- [x] POST /api/auth/login
- [x] POST /api/auth/logout
- [x] GET /api/auth/user

### Content APIs (Public)
- [x] GET /api/hero
- [x] GET /api/services
- [ ] GET /api/services/[slug]
- [ ] GET /api/statistics
- [ ] GET /api/about
- [ ] GET /api/projects
- [ ] GET /api/projects/[id]
- [ ] GET /api/blog
- [ ] GET /api/blog/[slug]
- [ ] GET /api/team
- [ ] GET /api/testimonials
- [ ] GET /api/partners
- [ ] POST /api/contact

### Admin APIs (Protected)
- [ ] PUT /api/admin/hero
- [ ] GET /api/admin/statistics
- [ ] POST /api/admin/statistics
- [ ] PUT /api/admin/statistics/[id]
- [ ] DELETE /api/admin/statistics/[id]
- [ ] POST /api/admin/services
- [ ] PUT /api/admin/services/[id]
- [ ] DELETE /api/admin/services/[id]
- [ ] POST /api/admin/projects
- [ ] PUT /api/admin/projects/[id]
- [ ] DELETE /api/admin/projects/[id]
- [ ] POST /api/admin/blog
- [ ] PUT /api/admin/blog/[id]
- [ ] DELETE /api/admin/blog/[id]
- [ ] POST /api/admin/team
- [ ] PUT /api/admin/team/[id]
- [ ] DELETE /api/admin/team/[id]

---

## حماية API Routes

### Middleware للمصادقة
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth();
    
    // Your protected logic here
    return NextResponse.json({ data: 'Protected data' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

---

## Dynamic Routes

### Express
```typescript
app.get('/api/services/:slug', async (req, res) => {
  const { slug } = req.params;
  // ...
});
```

### Next.js
```typescript
// src/app/api/services/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  // ...
}
```

---

## POST/PUT/DELETE Methods

### Express
```typescript
app.post('/api/services', async (req, res) => {
  const data = req.body;
  // ...
});
```

### Next.js
```typescript
export async function POST(request: NextRequest) {
  const data = await request.json();
  // ...
}
```

---

## الخطوات المتبقية

1. تحويل جميع GET routes
2. تحويل جميع POST/PUT/DELETE routes
3. إضافة المصادقة للـ admin routes
4. اختبار كل endpoint
5. إضافة error handling شامل

---

**الحالة**: 5/50+ APIs مكتملة (~10%)
