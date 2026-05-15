-- Align Order with Prisma schema (older DBs may still have NOT NULL website)
ALTER TABLE "Order" DROP COLUMN IF EXISTS "website";

-- CreateEnum
CREATE TYPE "ContactRequestStatus" AS ENUM ('NEW', 'PROCESSED');

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "status" "ContactRequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);
