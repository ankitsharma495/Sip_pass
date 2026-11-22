# Sip Pass (SipClub) — Monorepo

Daily coffee discovery and subscription platform across Indian metros (Bengaluru, Mumbai, Delhi NCR).

The project is structured into two completely independent, deployable services:

```
sipclub/
├── frontend/       # React Native mobile client (Expo SDK 58, TypeScript)
├── backend/        # Modular Monolith API (NestJS, PostgreSQL + PostGIS, Redis, Prisma)
├── DESIGN.md       # Stitch Design System tokens & specs
├── docker-compose.yml # Orchestrates full stack or local databases
└── package.json    # Root npm workspaces & convenience scripts
```

---

## Quick Start (Local Development)

### 1. Start Databases (Postgres with PostGIS + Redis)
```bash
docker compose up -d postgres redis
```
- PostgreSQL with PostGIS runs on port `5432`
- Redis runs on port `6380` (mapped to internal `6379`)

### 2. Start Backend API
```bash
npm run start:backend
```
Backend API will start at `http://localhost:3000/api/v1`.
Health check: `http://localhost:3000/api/v1/health`.

### 3. Start Frontend App (Expo)
```bash
npm run start:frontend
```
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open web preview
- Scan QR code with Expo Go on your mobile device

---

## Production Deployment Guides

### 1. Deploying the Backend
The backend in `backend/` includes a production multi-stage `Dockerfile`:

#### Option A: Docker / VPS / CapRover / Coolify
```bash
docker compose up --build -d
```
Runs `postgres`, `redis`, and the compiled `sipclub-api` container with automated health checks.

#### Option B: Cloud Platforms (Railway, Render, Fly.io)
1. Point your platform to the `/backend` directory.
2. Add a PostgreSQL database with PostGIS enabled and a Redis instance.
3. Configure environment variables matching `backend/.env.example`.
4. Deploy using the included `Dockerfile`.

---

### 2. Deploying the Frontend
The frontend in `frontend/` can be built and deployed via Expo Application Services (EAS):

#### Mobile Stores (iOS App Store & Google Play)
```bash
cd frontend
npm install -g eas-cli
eas login
eas build:configure
eas build --platform all --profile production
eas submit --platform all
```

#### Web Preview (Static Site)
```bash
cd frontend
npx expo export -p web
```
Upload `frontend/dist` to Netlify, Vercel, or Cloudflare Pages.

---

## Testing & Quality Assurance
- **Backend Unit Tests**: `npm run test:backend`
- **Backend Build**: `npm run build:backend`
- **Frontend Typecheck**: `cd frontend && npx tsc --noEmit`
