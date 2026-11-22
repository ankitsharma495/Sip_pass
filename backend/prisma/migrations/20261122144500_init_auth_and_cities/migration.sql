-- Enable PostGIS and UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create Enum for UserRole
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'BARISTA', 'CAFE_OWNER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Cities Table
CREATE TABLE IF NOT EXISTS "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- Create Unique Index on Cities slug
CREATE UNIQUE INDEX IF NOT EXISTS "cities_slug_key" ON "cities"("slug");

-- Create Users Table (partition-ready with city_id)
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "refresh_token_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create Unique Index on phone
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key" ON "users"("phone");

-- Create Performance Indexes for city_id and phone
CREATE INDEX IF NOT EXISTS "users_city_id_idx" ON "users"("city_id");
CREATE INDEX IF NOT EXISTS "users_phone_idx" ON "users"("phone");

-- Add Foreign Key Constraint
ALTER TABLE "users"
    ADD CONSTRAINT "users_city_id_fkey"
    FOREIGN KEY ("city_id") REFERENCES "cities"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
