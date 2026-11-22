# SipClub Backend (Modular Monolith)

Stateless backend API for the **SipClub Coffee Discovery & Subscription Platform**, engineered as a **Modular Monolith** using **NestJS**, **PostgreSQL with PostGIS**, **Redis**, and **Prisma ORM**.

Designed for multi-city scaling across Indian metro cities (Bengaluru, Mumbai, Delhi NCR). **Every table includes a mandatory `city_id` foreign key** for multi-tenant isolation, city-level querying, and future horizontal sharding/partitioning.

---

## 🏗️ Architecture & Modules

```
backend/
├── docker-compose.yml              # PostgreSQL + PostGIS (v16) & Redis (v7.2)
├── prisma/
│   ├── schema.prisma               # Multi-city Prisma schema (Cities, Users)
│   ├── seed.ts                     # Seeds default cities and demo user (Aarav Mehta)
│   └── migrations/                 # Version-controlled SQL migrations with PostGIS
└── src/
    ├── app.module.ts               # Root module aggregating modules & throttler guard
    ├── main.ts                     # Bootstrap, validation pipes, global error filter
    ├── common/
    │   ├── config/                 # Strict class-validator schema validation for .env
    │   ├── filters/                # Global standardized JSON exception filter
    │   ├── guards/                 # Passport JWT authentication guard
    │   ├── interceptors/           # Unified ApiResponse<T> transform wrapper
    │   └── prisma/                 # PrismaService with connection lifecycle management
    ├── redis/                      # Redis client with seamless in-memory fallback
    ├── health/                     # /health endpoint (DB & Redis readiness checks)
    └── modules/
        ├── auth/                   # Phone OTP login, mock provider, JWT token rotation
        └── users/                  # User persistence, city association, refresh token hash
```

*Planned modules for future phases:* `cafes`, `subscriptions`, `redemptions`, `payouts`.

---

## ⚙️ Prerequisites

- **Node.js**: `v20+` (tested on Node `v22`)
- **Docker & Docker Compose**: for PostgreSQL with PostGIS and Redis
- **npm** or **pnpm**

---

## 🚀 Quickstart

### 1. Start Database & Redis via Docker Compose

```bash
cd backend
docker-compose up -d
```

This starts:
- **PostgreSQL 16 with PostGIS** on port `5432` (database: `sipclub_dev`)
- **Redis 7.2** on port `6379`

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run SQL Migrations
npm run prisma:migrate

# Seed Metro Cities & Demo User
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run start:dev
```

The API will start at:
- **Base URL**: `http://localhost:3000/api/v1`
- **Health Check**: `http://localhost:3000/health`

---

## 🧪 Running Unit Tests

Run the full auth service test suite:

```bash
npm test
```

To run with coverage:
```bash
npm run test:cov
```

---

## 📡 API Endpoints (Phase 1 & 2)

### 1. Health Check
* **`GET /health`**
  * Checks database connectivity (`SELECT 1`) and Redis ping.
  * *Response:*
    ```json
    {
      "status": "ok",
      "timestamp": "2026-11-22T14:45:00.000Z",
      "uptime": 12.4,
      "services": {
        "database": "healthy",
        "redis": "healthy"
      }
    }
    ```

---

### 2. Authentication Flow (Real SMS Gateway via Fast2SMS)

Fast2SMS is integrated for real transactional OTP delivery to Indian mobile numbers:

1. **Get an API Key**: Sign up at [fast2sms.com](https://www.fast2sms.com) (free signup includes 50 free SMS credits).
2. **Add to `.env`**:
   ```env
   SMS_PROVIDER=fast2sms
   FAST2SMS_API_KEY=your_actual_fast2sms_api_key_here
   ```
3. **Test Numbers Bypass**:
   Numbers listed in `OTP_TEST_NUMBERS` (e.g. `+919820451290`) automatically use the mock OTP `4821` for testing and app store reviews without spending SMS credits.
4. **All other numbers**:
   Receive a real, randomly generated 4-digit OTP dispatched directly to their phone via Fast2SMS!

#### A. Request Phone OTP
* **`POST /api/v1/auth/otp/request`**
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "phone": "+919820451290",
    "cityId": "city-blr-01"
  }
  ```
* **Behavior**:
  - Normalizes 10-digit Indian numbers (`9820451290` → `+919820451290`).
  - Rate limited to max 5 requests per 10 minutes per phone number.
  - In development, generates mock OTP `4821` (configurable in `.env`).
  - Dispatches via `IOtpProvider` (mock provider logs to console).
  - Stores in Redis with 5-minute TTL.

#### B. Verify OTP & Issue Tokens
* **`POST /api/v1/auth/otp/verify`**
* **Body**:
  ```json
  {
    "phone": "+919820451290",
    "otp": "4821",
    "cityId": "city-blr-01"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1...",
      "refreshToken": "eyJhbGciOiJIUzI1...",
      "tokenType": "Bearer",
      "expiresIn": 900,
      "user": {
        "id": "c1f7a0b3-...",
        "phone": "+919820451290",
        "fullName": "Aarav Mehta",
        "cityId": "city-blr-01",
        "role": "CUSTOMER"
      }
    },
    "timestamp": "2026-11-22T14:45:00.000Z"
  }
  ```
* **Security**:
  - Consumes and deletes OTP from Redis immediately upon verification.
  - Refresh token is hashed with `bcrypt` (10 rounds) before saving to the database.

#### C. Refresh Access Token (Token Rotation)
* **`POST /api/v1/auth/refresh`**
* **Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
  ```
* **Behavior**: Rotates both the access token and refresh token, invalidating the previous refresh token.

#### D. Logout
* **`POST /api/v1/auth/logout`**
* **Headers**: `Authorization: Bearer <accessToken>`
* **Behavior**: Revokes refresh token hash in database.

#### E. Get Current Authenticated Profile
* **`GET /api/v1/auth/me`**
* **Headers**: `Authorization: Bearer <accessToken>`

---

## 🔒 Security & Performance Features

- **Global Throttling**: `@nestjs/throttler` limits requests to 30 requests/minute per IP.
- **Strict Validation**: Class-validator with `forbidNonWhitelisted: true` and `transform: true`.
- **Standardized Error Handling**: Unified JSON schema for all 4xx/5xx errors.
- **Fail-Safe Redis Fallback**: The `RedisService` includes an automatic in-memory cache fallback to ensure testing and dev modes work without hard stops if Redis is restarting.
- **Stateless Architecture**: No in-memory sessions; all authentication relies on short-lived signed JWTs.
