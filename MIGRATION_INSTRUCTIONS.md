# تعليمات تشغيل Migration على Railway

## المشكلة
جدول `users` غير موجود في قاعدة البيانات، مما يسبب خطأ عند محاولة تسجيل الدخول.

## الحل

### الطريقة 1: تشغيل Migration عبر Railway CLI (الموصى بها)

1. تثبيت Railway CLI:
```bash
npm install -g @railway/cli
```

2. تسجيل الدخول:
```bash
railway login
```

3. ربط المشروع:
```bash
railway link
```

4. تشغيل migration:
```bash
railway run npm run db:migrate
```

### الطريقة 2: استخدام Drizzle Kit Push

```bash
railway run npm run db:push
```

هذا سيقوم بمزامنة schema مع قاعدة البيانات تلقائياً.

### الطريقة 3: تشغيل SQL مباشرة في Railway Dashboard

1. افتح Railway Dashboard
2. اذهب إلى قاعدة البيانات PostgreSQL
3. افتح "Query" tab
4. انسخ محتوى ملف `migrations/001_create_users_table.sql`
5. شغّل الاستعلام

## التحقق من نجاح Migration

بعد تشغيل migration، يمكنك التحقق من خلال:

```bash
railway run node -e "const postgres = require('postgres'); const sql = postgres(process.env.DATABASE_URL); sql\`SELECT * FROM users\`.then(console.log).then(() => sql.end());"
```

## بيانات تسجيل الدخول

بعد إنشاء الجدول، يمكنك تسجيل الدخول باستخدام:
- **Email**: waleed.qodami@gmail.com
- **Password**: 3505490qwE@@

عند أول تسجيل دخول، سيتم إنشاء المستخدم تلقائياً بكلمة المرور المشفرة.

## ملاحظات

- جدول `users` يستخدم `gen_random_uuid()` لتوليد IDs
- كلمات المرور مشفرة باستخدام bcrypt
- الجلسات تستمر لمدة 7 أيام
- جميع مسارات `/admin` محمية بـ middleware
