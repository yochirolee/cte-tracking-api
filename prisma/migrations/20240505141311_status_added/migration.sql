/*
  Warnings:

  - You are about to drop the column `status` on the `Parcels` table. All the data in the column will be lost.
  - Added the required column `description` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parcels" DROP COLUMN "status",
ADD COLUMN     "statusId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
