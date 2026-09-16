-- DropForeignKey
ALTER TABLE "Constituency" DROP CONSTRAINT "Constituency_countyId_fkey";

-- DropForeignKey
ALTER TABLE "PollingStation" DROP CONSTRAINT "PollingStation_wardId_fkey";

-- DropForeignKey
ALTER TABLE "Ward" DROP CONSTRAINT "Ward_constituencyId_fkey";

-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionPosition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectionPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "pollingStationId" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "electionId" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Election_name_year_key" ON "Election"("name", "year");

-- CreateIndex
CREATE INDEX "ElectionPosition_electionId_idx" ON "ElectionPosition"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectionPosition_electionId_name_key" ON "ElectionPosition"("electionId", "name");

-- CreateIndex
CREATE INDEX "Candidate_electionId_idx" ON "Candidate"("electionId");

-- CreateIndex
CREATE INDEX "Candidate_positionId_idx" ON "Candidate"("positionId");

-- CreateIndex
CREATE INDEX "Result_candidateId_idx" ON "Result"("candidateId");

-- CreateIndex
CREATE INDEX "Result_pollingStationId_idx" ON "Result"("pollingStationId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_candidateId_pollingStationId_key" ON "Result"("candidateId", "pollingStationId");

-- CreateIndex
CREATE INDEX "Constituency_countyId_idx" ON "Constituency"("countyId");

-- CreateIndex
CREATE INDEX "PollingStation_wardId_idx" ON "PollingStation"("wardId");

-- CreateIndex
CREATE INDEX "Ward_constituencyId_idx" ON "Ward"("constituencyId");

-- AddForeignKey
ALTER TABLE "Constituency" ADD CONSTRAINT "Constituency_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "Constituency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollingStation" ADD CONSTRAINT "PollingStation_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionPosition" ADD CONSTRAINT "ElectionPosition_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "ElectionPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_pollingStationId_fkey" FOREIGN KEY ("pollingStationId") REFERENCES "PollingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;
