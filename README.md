# CaféPass — Raqamli Sodiqlik Platformasi

**One digital identity + loyalty platform connecting customers and cafés.**

Pilot: Namangan, O'zbekiston

---

## 🏗 Architecture

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

## 📁 Project Structure

```
cafepass/
├── src/                    # Frontend (React + TypeScript + Tailwind)
│   ├── api/               # API client
│   ├── contexts/          # Auth context
│   ├── pages/             # Page components by role
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx       # OTP login/register
│   │   ├── CustomerPages.tsx
│   │   ├── OwnerPages.tsx
│   │   ├── EmployeePages.tsx
│   │   └── AdminPages.tsx
│   ├── types/             # TypeScript types
│   └── index.css          # Tailwind + custom styles
├── server/                 # Backend (Express + Prisma)
│   ├── src/
│   │   ├── index.ts       # Express app entry
│   │   ├── middleware/    # Auth, RBAC middleware
│   │   ├── routes/        # API routes by role
│   │   ├── services/      # SMS, loyalty services
│   │   └── utils/         # Validation utilities
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── .env.example
├── render.yaml            # Render deployment config
└── .env.example           # Frontend env config
```

## 🔐 Roles & Permissions

| Role | Access |
|------|--------|
| **CUSTOMER** | Dashboard, QR, cafés, rewards, history, leaderboard |
| **CAFE_EMPLOYEE** | Scan QR, process purchases, redeem rewards |
| **CAFE_OWNER** | Full café management, analytics, staff, rewards, promotions |
| **PLATFORM_ADMIN** | Create/manage cafés, assign owners, platform analytics, audit logs |

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database URL and secrets
npx prisma migrate dev
npm run dev
```

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
JWT_SECRET=your-strong-secret-here
FRONTEND_URL=http://localhost:3000
SMS_PROVIDER=dev  # or 'eskiz' for production
ESKIZ_EMAIL=your@email.com
ESKIZ_PASSWORD=your-password
```

## 📱 User Flows

### Customer
1. Register with phone → Receive OTP via SMS → Verify
2. View dashboard with points, level, progress
3. Generate QR code (refreshes every 60s)
4. Visit café → Employee scans QR → Purchase processed → Points earned
5. Redeem rewards at partner cafés
6. View transaction history, leaderboard

### Employee
1. Login → Dashboard with today's stats
2. Scan customer QR → Identify customer
3. Enter purchase amount → Points calculated → Transaction recorded
4. Process reward redemptions

### Café Owner
1. Login → Full dashboard with analytics
2. View customers, transactions, revenue
3. Manage rewards, promotions, branches, employees
4. Weekly/monthly analytics

### Platform Admin
1. Login → Platform overview
2. Add new café (creates café + branch + owner account)
3. Manage all cafés, view platform analytics
4. Audit logs for all important actions

## 🗄 Database Schema

Key entities:
- **User** — Authentication, roles
- **CustomerProfile** — Points, level, stats (denormalized from transactions)
- **Cafe** — Multi-tenant café with loyalty rate
- **CafeBranch** — Multiple locations per café
- **CafeStaff** — Owner/employee assignments
- **Purchase** — Transaction records
- **LoyaltyTransaction** — Traceable ledger (source of truth for points)
- **Reward** — Available rewards per café
- **RewardRedemption** — Redemption records
- **Promotion** — Time-limited offers
- **QRSession** — Short-lived secure tokens
- **AuditLog** — Platform action tracking

## 🔒 Security

- JWT-based authentication with 7-day expiry
- Role-based access control enforced on backend
- Tenant isolation: cafés can only access their own data
- Short-lived QR tokens (60s expiry)
- OTP rate limiting (3/hour per phone)
- Phone number validation (Uzbekistan format)
- Audit logging for important actions
- Helmet.js security headers
- CORS configuration
- Rate limiting on all API endpoints

## 📊 SMS OTP Integration

**Provider:** Eskiz.uz (Uzbekistan SMS gateway)

**Flow:**
1. User enters phone → Backend validates format
2. Backend generates 4-digit OTP → Stores hash
3. SMS sent via Eskiz API
4. User enters OTP → Backend verifies
5. On success: User created/updated → JWT issued

**Development mode:** OTP logged to console (no SMS sent)

## 🌍 Deployment (Render)

```yaml
Services:
- cafepass-api (Node.js backend)
- cafepass-frontend (Static site)
- cafepass-db (PostgreSQL)
```

See `render.yaml` for full configuration.

## 📈 Pilot Metrics

Track during pilot:
- Active cafés onboarded
- Active customers registered
- Repeat visits per customer
- Loyalty redemptions
- Average revenue per café
- Customer retention rate

---

**Built for Namangan cafés. Designed for Uzbekistan. Ready for scale.**
