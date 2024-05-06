/*
  Warnings:

  - You are about to drop the column `detailId` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the `CarrierTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Carriers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParcelDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provinces` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[hbloc]` on the table `ParcelEvents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver` to the `Parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Parcels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddress` to the `Parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParcelDetails" DROP CONSTRAINT "ParcelDetails_carrierId_fkey";

-- DropForeignKey
ALTER TABLE "ParcelDetails" DROP CONSTRAINT "ParcelDetails_carrierTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ParcelDetails" DROP CONSTRAINT "ParcelDetails_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "Parcels" DROP CONSTRAINT "Parcels_detailId_fkey";

-- DropForeignKey
ALTER TABLE "Parcels" DROP CONSTRAINT "Parcels_statusId_fkey";

-- AlterTable
ALTER TABLE "Parcels" DROP COLUMN "detailId",
DROP COLUMN "statusId",
ADD COLUMN     "carrier" TEXT NOT NULL DEFAULT 'Transcargo',
ADD COLUMN     "carrierType" TEXT NOT NULL DEFAULT 'Maritimo',
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "receiver" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "shippingAddress" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'En transito';

-- DropTable
DROP TABLE "CarrierTypes";

-- DropTable
DROP TABLE "Carriers";

-- DropTable
DROP TABLE "ParcelDetails";

-- DropTable
DROP TABLE "Provinces";

-- CreateIndex
CREATE UNIQUE INDEX "ParcelEvents_hbloc_key" ON "ParcelEvents"("hbloc");

-- CreateIndex
CREATE INDEX "Parcels_hbl_invoiceId_currentLocation_idx" ON "Parcels"("hbl", "invoiceId", "currentLocation");
