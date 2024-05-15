/*
  Warnings:

  - You are about to drop the column `detailsId` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the `EventDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UpdateMethod" AS ENUM ('SCAN', 'EXCEL_FILE', 'MANUAL');

-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_detailsId_fkey";

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "detailsId";

-- DropTable
DROP TABLE "EventDetails";

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "hbloc" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "imagsUrl" TEXT,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_hbloc_fkey" FOREIGN KEY ("hbloc") REFERENCES "Events"("hbloc") ON DELETE CASCADE ON UPDATE CASCADE;
