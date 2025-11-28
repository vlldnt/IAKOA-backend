-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_companyId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_eventId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_eventId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_userId_fkey";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3),
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" UUID NOT NULL,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "events" DROP CONSTRAINT "events_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "date" SET DATA TYPE TIMESTAMPTZ(3),
DROP COLUMN "companyId",
ADD COLUMN     "companyId" UUID NOT NULL,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "media" DROP CONSTRAINT "media_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(50),
DROP COLUMN "eventId",
ADD COLUMN     "eventId" UUID NOT NULL,
ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_favorites" DROP CONSTRAINT "user_favorites_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "eventId",
ADD COLUMN     "eventId" UUID NOT NULL,
ADD CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "companies_ownerId_idx" ON "companies"("ownerId");

-- CreateIndex
CREATE INDEX "companies_siren_idx" ON "companies"("siren");

-- CreateIndex
CREATE INDEX "companies_isValidated_idx" ON "companies"("isValidated");

-- CreateIndex
CREATE INDEX "events_companyId_idx" ON "events"("companyId");

-- CreateIndex
CREATE INDEX "events_date_idx" ON "events"("date");

-- CreateIndex
CREATE INDEX "events_pricing_idx" ON "events"("pricing");

-- CreateIndex
CREATE INDEX "media_eventId_idx" ON "media"("eventId");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "user_favorites_userId_idx" ON "user_favorites"("userId");

-- CreateIndex
CREATE INDEX "user_favorites_eventId_idx" ON "user_favorites"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_eventId_key" ON "user_favorites"("userId", "eventId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_isCreator_idx" ON "users"("isCreator");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

