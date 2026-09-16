/*
  Warnings:

  - Made the column `electionId` on table `Result` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_electionId_fkey";

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "electionId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Result_electionId_idx" ON "Result"("electionId");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
