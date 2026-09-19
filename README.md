# CaféPass — Raqamli Sodiqlik Platformasi

**One digital identity + loyalty platform connecting customers and cafés.**

Pilot: Namangan, O'zbekiston

---

## 🏗 Arxitektura

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│   Frontend      │────▶│   Backend API        │────▶│  PostgreSQL  │
│   React + Vite  │     │   Express + Prisma   │     │  Database    │
│   Tailwind CSS  │     │   JWT Auth           │     │              │
└─────────────────┘     └─────────────────────┘     └──────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  SMS Provider   │
                        │  (Eskiz.uz)     │
                        └─────────────────┘
```

## 📁 Loyiha Tuzilishi

```
cafepass/
├── src/                    # Frontend (React + TypeScript + Tailwind)
│   ├── api/               # API client
│   ├── contexts/          # Auth context
│   ├── pages/             # Sahifalar
│   │   ├── Landing.tsx    # Landing sahifa
│   │   ├── Auth.tsx       # OTP login/register
│   │   ├── CustomerPages.tsx  # Mijoz paneli
│   │   ├── OwnerPages.tsx     # Kafe egasi paneli
│   │   ├── EmployeePages.tsx  # Xodim paneli
│   │   └── AdminPages.tsx     # Admin paneli
│   ├── types/             # TypeScript turlari
│   └── index.css          # Tailwind + custom styles
├── server/                 # Backend (Express + Prisma)
│   ├── src/
│   │   ├── index.ts       # Express app
│   │   ├── lib/           # Shared utilities (prisma singleton)
│   │   ├── middleware/    # Auth, RBAC middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # SMS service
│   │   └── utils/         # Validation
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── scripts/
│       └── seed-dev.ts    # Development test accounts
├── tests/                  # Automated tests
├── render.yaml            # Render deployment config
└── .env.example           # Environment variables
```

## 🔐 Rollar

| Rol | Kirish |
|-----|--------|
| **CUSTOMER** | Dashboard, QR, kafelar, sovg'alar, tarix, reyting |
| **CAFE_EMPLOYEE** | QR skanerlash, sotuv qayd etish, sovg'a berish |
| **CAFE_OWNER** | Kafe boshqaruvi, analitika, xodimlar, sovg'alar |
| **PLATFORM_ADMIN** | Kafe yaratish, egalar tayinlash, platforma analitika |

## 🚀 Ishga Tushirish

### 1. Backend

```bash
cd server

# Dependencies o'rnatish
npm install

# .env fayl yaratish
cp .env.example .env

# .env faylni tahrirlash:
# DATABASE_URL=postgresql://user:pass@host:5432/cafepass
# JWT_SECRET=<openssl rand -base64 32>
# SMS_PROVIDER=eskiz
# ESKIZ_EMAIL=your@email.com
# ESKIZ_PASSWORD=your-password

# Database migrations
npx prisma migrate dev

# Development test accountlar yaratish
npx tsx scripts/seed-dev.ts

# Server ishga tushirish
npm run dev
```

### 2. Frontend

```bash
# Root papkada
npm install

# .env fayl yaratish
cp .env.example .env
# VITE_API_URL=http://localhost:3001/api

# Development server
npm run dev
```

### 3. Testlar

```bash
# Barcha testlarni ishga tushirish
npm run test

# Watch mode
npm run test:watch
```

## 📱 Foydalanuvchi Oqimlari

### Mijoz
1. Telefon raqam → OTP → Ro'yxatdan o'tish
2. Dashboard → Ball, daraja, statistika
3. QR kod → 60 soniyada yangilanadi
4. Kafe → Xodim QR skanerlaydi
5. Sotuv → Ball beriladi
6. Sovg'a → Ballni almashtirish

### Xodim
1. Login → Dashboard
2. Mijoz QR tokenini kiritish
3. Mijoz ma'lumotlarini ko'rish
4. Sotuv summasini kiritish
5. Ball hisoblash va qayd etish

### Kafe Egasi
1. Login → Dashboard
2. Statistika: tashriflar, tushum, mijozlar
3. Xodimlar boshqaruvi
4. Sovg'alar va aksiyalar
5. Analitika

### Admin
1. Login → Platforma dashboard
2. Yangi kafe qo'shish (kafe + filial + ega)
3. Barcha kafelarni boshqarish
4. Audit loglar

## 🗄 Database Schema

Asosiy jadvallar:
- **User** — Autentifikatsiya, rollar
- **CustomerProfile** — Ball, daraja, statistika
- **Cafe** — Kafe ma'lumotlari
- **CafeBranch** — Filiallar
- **CafeStaff** — Xodimlar (ega/xodim)
- **Purchase** — Sotuvlar
- **LoyaltyTransaction** — Ball tranzaksiyalari (ledger)
- **Reward** — Sovg'alar
- **RewardRedemption** — Sovg'a almashtirish
- **Promotion** — Aksiyalar
- **QRSession** — QR tokenlar (60s, bir martalik)
- **AuditLog** — Harakatlar jurnali

## 🔒 Xavfsizlik

- ✅ JWT autentifikatsiya (7 kun)
- ✅ bcrypt OTP hash
- ✅ Role-based access control (backend)
- ✅ Tenant isolation (kafe A ↔ kafe B)
- ✅ QR token 60s, bir martalik
- ✅ Rate limiting (100 req/15min, auth 10/15min)
- ✅ Server-side validation
- ✅ Audit logging
- ✅ Helmet.js security headers
- ✅ CORS configuration

## 📊 Testlar

Testlar mavjud:
- `tests/validation.test.ts` — Telefon validatsiya
- `tests/auth.test.ts` — JWT autentifikatsiya
- `tests/otp-security.test.ts` — OTP bcrypt hash/verify
- `tests/loyalty.test.ts` — Ball hisoblash
- `tests/tenant-isolation.test.ts` — RBAC va tenant isolation
- `tests/qr-security.test.ts` — QR token xavfsizlik

Testlarni ishga tushirish:
```bash
npm run test
```

## 🌍 Deployment (Render)

```yaml
Services:
- cafepass-api (Node.js backend)
- cafepass-frontend (Static site)
- cafepass-db (PostgreSQL)
```

`render.yaml` fayli tayyor.

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/cafepass
JWT_SECRET=<strong-random-string>
FRONTEND_URL=http://localhost:3000
SMS_PROVIDER=dev  # yoki 'eskiz' production uchun
ESKIZ_EMAIL=your@email.com
ESKIZ_PASSWORD=your-password
```

## 📈 Pilot Ko'rsatkichlari

Pilot davrida kuzatish:
- Faol kafelar soni
- Ro'yxatdan o'tgan mijozlar
- Takroriy tashriflar
- Sovg'a almashtirishlar
- O'rtacha tushum
- Mijozlarni saqlash darajasi

---

**Namangan kafelari uchun yaratilgan. O'zbekiston uchun mo'ljallangan. Masshtablashga tayyor.**

## 🛠 Development Test Accountlar

Seed script ishga tushirilgandan keyin:

| Rol | Telefon | Tavsif |
|-----|---------|--------|
| Admin | +998901111111 | Platform administrator |
| Owner | +998902222222 | Kafe egasi (Artel Coffee) |
| Employee | +998903333333 | Xodim |
| Customer | +998904444444 | Mijoz (500 ball) |

**Eslatma:** Test accountlar faqat development muhitida ishlaydi. Production'da haqiqiy OTP autentifikatsiya ishlatiladi.

## ✅ Tekshirilgan Funksiyalar

- ✅ OTP autentifikatsiya (bcrypt hash)
- ✅ JWT session boshqaruvi
- ✅ Role-based routing
- ✅ QR token generatsiya (60s, bir martalik)
- ✅ QR skanerlash va mijozni aniqlash
- ✅ Sotuv qayd etish va ball berish
- ✅ Tenant isolation
- ✅ Loyalty transaction ledger
- ✅ Audit logging
- ✅ Rate limiting
- ✅ Error handling

## ⚠️ Ma'lum

- PostgreSQL database kerak
- SMS provider credentials kerak (production uchun)
- JWT_SECRET production value kerak
- Prisma migrations ishga tushirish kerak

---

**Loyiha tayyor. Infrastructure kerak.**
