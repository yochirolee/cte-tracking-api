/*
  Warnings:

  - You are about to drop the `parcels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_parcelHbl_fkey";

-- DropForeignKey
ALTER TABLE "parcels" DROP CONSTRAINT "parcels_currentLocation_fkey";

-- DropTable
DROP TABLE "parcels";

-- CreateTable
CREATE TABLE "Parcels" (
    "hbl" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "containerId" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'En transito',
    "carrier" TEXT NOT NULL DEFAULT 'Transcargo',
    "carrierType" TEXT NOT NULL DEFAULT 'Maritimo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentLocation" INTEGER NOT NULL,

    CONSTRAINT "Parcels_pkey" PRIMARY KEY ("hbl")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parcels_hbl_key" ON "Parcels"("hbl");

-- CreateIndex
CREATE INDEX "Parcels_hbl_invoiceId_currentLocation_idx" ON "Parcels"("hbl", "invoiceId", "currentLocation");

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_currentLocation_fkey" FOREIGN KEY ("currentLocation") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_parcelHbl_fkey" FOREIGN KEY ("parcelHbl") REFERENCES "Parcels"("hbl") ON DELETE RESTRICT ON UPDATE CASCADE;
