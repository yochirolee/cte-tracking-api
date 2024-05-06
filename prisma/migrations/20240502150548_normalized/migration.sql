/*
  Warnings:

  - You are about to drop the column `carrier` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `carrierType` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Parcels` table. All the data in the column will be lost.
  - Added the required column `detailId` to the `Parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ParcelEvents_hbloc_key";

-- DropIndex
DROP INDEX "Parcels_hbl_invoiceId_currentLocation_idx";

-- AlterTable
ALTER TABLE "Parcels" DROP COLUMN "carrier",
DROP COLUMN "carrierType",
DROP COLUMN "city",
DROP COLUMN "province",
DROP COLUMN "receiver",
DROP COLUMN "sender",
DROP COLUMN "shippingAddress",
DROP COLUMN "status",
ADD COLUMN     "detailId" INTEGER NOT NULL,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ParcelDetails" (
    "id" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "carrierId" INTEGER NOT NULL,
    "carrierTypeId" INTEGER NOT NULL,

    CONSTRAINT "ParcelDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carriers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierTypes" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provinces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provinces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ParcelStatuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "ParcelDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelDetails" ADD CONSTRAINT "ParcelDetails_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelDetails" ADD CONSTRAINT "ParcelDetails_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelDetails" ADD CONSTRAINT "ParcelDetails_carrierTypeId_fkey" FOREIGN KEY ("carrierTypeId") REFERENCES "CarrierTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
