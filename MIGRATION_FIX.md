# إصلاح مشكلة جدول Users - Migration

## المشكلة المكتشفة

من سجلات Railway:
```
Error: column "password" does not exist
```

هذا يعني أن:
1. ✅ جدول `users` موجود في قاعدة البيانات
2. ❌ لكن الأعمدة المطلوبة ناقصة (password, first_name, last_name, إلخ)

## الحل

### الخطوة 1: تشغيل Migration لإضافة الأعمدة الناقصة

استخدم Railway CLI لتشغيل migration:

```bash
railway run npm run db:migrate:002
```

أو يمكنك تنفيذ SQL مباشرة في Railway Dashboard:

1. افتح Railway Dashboard
2. اذهب إلى PostgreSQL database
3. افتح "Query" tab
4. انسخ محتوى `migrations/002_add_missing_columns.sql`
5. شغّل الاستعلام

### الخطوة 2: التحقق من نجاح Migration

بعد تشغيل migration، يجب أن تظهر جميع الأعمدة:
- ✅ id
- ✅ email
- ✅ password
- ✅ first_name
- ✅ last_name
- ✅ profile_image_url
- ✅ role
- ✅ is_active
- ✅ reset_token
- ✅ reset_token_expiry
- ✅ created_at
- ✅ updated_at

### الخطوة 3: اختبار تسجيل الدخول

بعد نجاح migration، جرب تسجيل الدخول:

**URL**: https://buildo-production-c8b4.up.railway.app/login

**بيانات الدخول**:
- Email: `waleed.qodami@gmail.com`
- Password: `3505490qwE@@`

عند أول تسجيل دخول، سيتم إنشاء المستخدم تلقائياً إذا لم يكن موجوداً.

## البديل: استخدام Drizzle Kit Push

إذا لم تنجح الطريقة أعلاه، يمكنك استخدام:

```bash
railway run npm run db:push
```

هذا سيقوم بمزامنة schema مع قاعدة البيانات تلقائياً.

## ملاحظات مهمة

- ⚠️ Migration آمن ولن يحذف أي بيانات موجودة
- ⚠️ يستخدم `DO $$ BEGIN ... END $$` للتحقق قبل إضافة كل عمود
- ⚠️ إذا كان العمود موجوداً، لن يتم إضافته مرة أخرى
- ✅ بعد نجاح migration، سيعمل نظام المصادقة بشكل كامل
