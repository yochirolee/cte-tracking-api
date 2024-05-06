/*
  Warnings:

  - You are about to drop the column `containerId` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the `ParcelEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParcelStatuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_hbl_fkey";

-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_locationId_fkey";

-- DropIndex
DROP INDEX "Parcels_hbl_invoiceId_currentLocationId_idx";

-- AlterTable
ALTER TABLE "Parcels" DROP COLUMN "containerId",
DROP COLUMN "invoiceId";

-- DropTable
DROP TABLE "ParcelEvents";

-- DropTable
DROP TABLE "ParcelStatuses";

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "hbloc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hbl" TEXT NOT NULL,
    "locationId" INTEGER,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Events_hbloc_key" ON "Events"("hbloc");

-- CreateIndex
CREATE INDEX "Parcels_hbl_currentLocationId_idx" ON "Parcels"("hbl", "currentLocationId");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_hbl_fkey" FOREIGN KEY ("hbl") REFERENCES "Parcels"("hbl") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
