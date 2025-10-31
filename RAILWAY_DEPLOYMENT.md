# 🚂 دليل النشر على Railway

> **دليل شامل لنشر مشروع Next.js على Railway**

---

## 📋 المتطلبات

- حساب على [Railway](https://railway.app)
- المشروع على GitHub
- قاعدة بيانات PostgreSQL

---

## 🚀 خطوات النشر

### 1. إنشاء مشروع على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. اضغط **"New Project"**
3. اختر **"Deploy from GitHub repo"**
4. اختر المستودع `buildo-nextjs`

---

### 2. إضافة قاعدة بيانات PostgreSQL

1. في نفس المشروع، اضغط **"New"**
2. اختر **"Database"** → **"PostgreSQL"**
3. انتظر حتى يتم إنشاء قاعدة البيانات
4. اضغط على PostgreSQL service
5. اذهب إلى تبويب **"Connect"**
6. انسخ **"DATABASE_URL"** (Postgres Connection URL)

---

### 3. إعداد Environment Variables

في service الخاص بـ Next.js:

1. اذهب إلى تبويب **"Variables"**
2. أضف المتغيرات التالية:

```env
# Database (Required)
DATABASE_URL=<paste-from-postgres-service>

# Authentication (Required)
JWT_SECRET=<generate-random-32-char-string>
ADMIN_EMAIL=admin@buildit-professional.com
ADMIN_PASSWORD=<your-secure-password>

# Next.js (Required)
NEXT_PUBLIC_SITE_URL=https://<your-app>.railway.app

# Email (Optional - for contact forms)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com

# Node.js Version (Required)
NODE_VERSION=20.18.0
```

#### 💡 كيفية توليد JWT_SECRET

```bash
# في terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 4. إعداد Build Settings

في تبويب **"Settings"**:

#### Build Command
```bash
npm install && npm run db:push && npm run build
```

#### Start Command
```bash
npm start
```

#### Root Directory
```
/
```

---

### 5. Deploy

1. اضغط **"Deploy"**
2. انتظر حتى يكتمل البناء (~2-5 دقائق)
3. Railway سيعطيك URL للموقع

---

## 🔧 بعد النشر

### تطبيق Database Schema

إذا لم يتم تطبيق schema تلقائياً:

```bash
# في Railway CLI
railway run npm run db:push
```

أو يمكنك إضافة `npm run db:push` في Build Command.

---

### التحقق من الموقع

1. افتح الـ URL الذي أعطاه Railway
2. تحقق من الصفحة الرئيسية
3. جرّب تسجيل الدخول: `/login`
   - Email: `admin@buildit-professional.com`
   - Password: ما أدخلته في `ADMIN_PASSWORD`

---

## 📊 Monitoring

### Logs

في تبويب **"Deployments"**:
- اضغط على آخر deployment
- اضغط **"View Logs"**
- راقب الأخطاء

### Metrics

في تبويب **"Metrics"**:
- CPU Usage
- Memory Usage
- Network

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Build Failed

**الحل**:
1. تحقق من Logs
2. تأكد من `NODE_VERSION=20.18.0`
3. تأكد من وجود `DATABASE_URL`

### المشكلة: Database Connection Error

**الحل**:
1. تحقق من `DATABASE_URL` صحيح
2. تأكد من أن PostgreSQL service يعمل
3. جرّب `railway run npm run db:push`

### المشكلة: 500 Error في APIs

**الحل**:
1. افحص Logs
2. تأكد من تطبيق schema: `npm run db:push`
3. تحقق من Environment Variables

### المشكلة: Authentication لا يعمل

**الحل**:
1. تحقق من `JWT_SECRET` موجود
2. تحقق من `ADMIN_EMAIL` و `ADMIN_PASSWORD`
3. امسح cookies وحاول مرة أخرى

---

## 💰 التكلفة

### Railway Pricing

- **Hobby Plan** (مجاني):
  - $5 credit شهرياً
  - يكفي لمشاريع صغيرة
  
- **Developer Plan** ($5/شهر):
  - $5 credit + $5 إضافية
  - مناسب لمشاريع متوسطة

### التكلفة المتوقعة

- **Next.js Service**: ~$2-3/شهر
- **PostgreSQL**: ~$2-3/شهر
- **إجمالي**: ~$4-6/شهر

---

## 🔄 التحديثات

### Auto Deploy

Railway يدعم Auto Deploy:
- كل push إلى `main` branch
- سيتم deploy تلقائياً

### Manual Deploy

في تبويب **"Deployments"**:
- اضغط **"Deploy"**
- اختر branch
- اضغط **"Deploy"**

---

## 📝 Checklist قبل النشر

- [ ] جميع Environment Variables مضافة
- [ ] `NODE_VERSION=20.18.0` مضاف
- [ ] `DATABASE_URL` صحيح
- [ ] `JWT_SECRET` مولّد
- [ ] `ADMIN_PASSWORD` قوي
- [ ] Build Command صحيح
- [ ] Start Command صحيح
- [ ] المشروع يبني محلياً بدون أخطاء

---

## 🎉 النشر الناجح!

بعد النشر الناجح:
1. ✅ الموقع يعمل على Railway
2. ✅ قاعدة البيانات متصلة
3. ✅ Authentication يعمل
4. ✅ APIs تعمل

---

## 📞 الدعم

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Next.js Docs: https://nextjs.org/docs

---

**حظاً موفقاً! 🚀**
