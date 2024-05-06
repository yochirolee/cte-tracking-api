/*
  Warnings:

  - You are about to drop the `Parcels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_parcelHbl_fkey";

-- DropForeignKey
ALTER TABLE "Parcels" DROP CONSTRAINT "Parcels_currentLocation_fkey";

-- DropTable
DROP TABLE "Parcels";

-- CreateTable
CREATE TABLE "parcels" (
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

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("hbl")
);

-- CreateIndex
CREATE UNIQUE INDEX "parcels_hbl_key" ON "parcels"("hbl");

-- CreateIndex
CREATE INDEX "parcels_hbl_invoiceId_currentLocation_idx" ON "parcels"("hbl", "invoiceId", "currentLocation");

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_currentLocation_fkey" FOREIGN KEY ("currentLocation") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_parcelHbl_fkey" FOREIGN KEY ("parcelHbl") REFERENCES "parcels"("hbl") ON DELETE RESTRICT ON UPDATE CASCADE;
