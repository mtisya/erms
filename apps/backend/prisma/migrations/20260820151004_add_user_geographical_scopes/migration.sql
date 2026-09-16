/*
  Warnings:

  - A unique constraint covering the columns `[electionId,candidateId,pollingStationId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ScopeLevel" AS ENUM ('COUNTY', 'CONSTITUENCY', 'WARD', 'POLLING_STATION');

-- DropIndex
DROP INDEX "Result_candidateId_pollingStationId_key";

-- CreateTable
CREATE TABLE "UserScope" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "ScopeLevel" NOT NULL,
    "countyId" TEXT,
    "constituencyId" TEXT,
    "wardId" TEXT,
    "pollingStationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserScope_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserScope_userId_idx" ON "UserScope"("userId");

-- CreateIndex
CREATE INDEX "UserScope_level_idx" ON "UserScope"("level");

-- CreateIndex
CREATE INDEX "UserScope_countyId_idx" ON "UserScope"("countyId");

-- CreateIndex
CREATE INDEX "UserScope_constituencyId_idx" ON "UserScope"("constituencyId");

-- CreateIndex
CREATE INDEX "UserScope_wardId_idx" ON "UserScope"("wardId");

-- CreateIndex
CREATE INDEX "UserScope_pollingStationId_idx" ON "UserScope"("pollingStationId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "Result_electionId_candidateId_pollingStationId_key" ON "Result"("electionId", "candidateId", "pollingStationId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "Constituency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_pollingStationId_fkey" FOREIGN KEY ("pollingStationId") REFERENCES "PollingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
