# 🔍 تتبع مشاكل API

## المشاكل المُبلّغ عنها

### 405 Method Not Allowed
1. `/api/admin/company-initiatives` (8 مرات)
2. `/api/admin/legal-pages` (2 مرات)
3. `/api/admin/email/templates` (2 مرات)

### 404 Not Found
1. `/admin/settings/company` (صفحة)
2. `/api/admin/settings/contact-form` (3 مرات)
3. `/api/admin/settings/footer` (3 مرات)
4. `/api/admin/backups` (3 مرات)

---

## التحليل

### 405 Method Not Allowed
**السبب المحتمل:** الـ API endpoint موجود لكن لا يدعم الـ HTTP method المستخدم (مثلاً GET غير موجود، فقط POST).

### 404 Not Found
**السبب المحتمل:** الـ API endpoint أو الصفحة غير موجودة، أو المسار خاطئ.
