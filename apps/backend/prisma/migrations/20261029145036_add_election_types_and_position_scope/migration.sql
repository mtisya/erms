/*
  Warnings:

  - A unique constraint covering the columns `[userId,level,countyId,constituencyId,wardId,pollingStationId]` on the table `UserScope` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('GENERAL', 'BY_ELECTION');

-- CreateEnum
CREATE TYPE "PositionScope" AS ENUM ('NATIONAL', 'COUNTY', 'CONSTITUENCY', 'WARD');

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "electionType" "ElectionType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "ElectionPosition" ADD COLUMN     "scope" "PositionScope" NOT NULL DEFAULT 'COUNTY';

-- CreateIndex
CREATE UNIQUE INDEX "UserScope_userId_level_countyId_constituencyId_wardId_polli_key" ON "UserScope"("userId", "level", "countyId", "constituencyId", "wardId", "pollingStationId");
