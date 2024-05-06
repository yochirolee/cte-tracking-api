/*
  Warnings:

  - You are about to drop the column `carrier` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `carrierType` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocation` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Parcels` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Parcels` table. All the data in the column will be lost.
  - Added the required column `currentLocationId` to the `Parcels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Parcels" DROP CONSTRAINT "Parcels_currentLocation_fkey";

-- DropIndex
DROP INDEX "Parcels_hbl_invoiceId_currentLocation_idx";

-- AlterTable
ALTER TABLE "Parcels" DROP COLUMN "carrier",
DROP COLUMN "carrierType",
DROP COLUMN "city",
DROP COLUMN "currentLocation",
DROP COLUMN "description",
DROP COLUMN "province",
DROP COLUMN "receiver",
DROP COLUMN "sender",
DROP COLUMN "shippingAddress",
DROP COLUMN "weight",
ADD COLUMN     "currentLocationId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Parcels_hbl_invoiceId_currentLocationId_idx" ON "Parcels"("hbl", "invoiceId", "currentLocationId");

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
