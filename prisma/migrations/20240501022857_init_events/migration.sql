/*
  Warnings:

  - You are about to drop the column `parcelHbl` on the `ParcelEvents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hbloc]` on the table `ParcelEvents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hbl` to the `ParcelEvents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hbloc` to the `ParcelEvents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_parcelHbl_fkey";

-- AlterTable
ALTER TABLE "ParcelEvents" DROP COLUMN "parcelHbl",
ADD COLUMN     "hbl" TEXT NOT NULL,
ADD COLUMN     "hbloc" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ParcelEvents_hbloc_key" ON "ParcelEvents"("hbloc");

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_hbl_fkey" FOREIGN KEY ("hbl") REFERENCES "Parcels"("hbl") ON DELETE RESTRICT ON UPDATE CASCADE;
