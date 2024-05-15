/*
  Warnings:

  - You are about to drop the column `imagsUrl` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "imagsUrl",
ADD COLUMN     "imageUrl" TEXT;
