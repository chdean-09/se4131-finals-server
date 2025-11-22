-- CreateEnum
CREATE TYPE "FeedType" AS ENUM ('SCHEDULED', 'MANUAL');

-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "feed_histories" (
    "id" TEXT NOT NULL,
    "type" "FeedType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_schedules" (
    "id" TEXT NOT NULL,
    "days" "WeekDays"[],
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_schedules_pkey" PRIMARY KEY ("id")
);
