-- DropForeignKey
ALTER TABLE "ParcelEvents" DROP CONSTRAINT "ParcelEvents_hbl_fkey";

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_hbl_fkey" FOREIGN KEY ("hbl") REFERENCES "Parcels"("hbl") ON DELETE CASCADE ON UPDATE CASCADE;
