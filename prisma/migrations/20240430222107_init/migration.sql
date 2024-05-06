-- CreateTable
CREATE TABLE "Parcels" (
    "id" SERIAL NOT NULL,
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
    "status" TEXT NOT NULL,
    "carrier" TEXT NOT NULL DEFAULT 'Transcargo',
    "carrierType" TEXT NOT NULL DEFAULT 'Maritimo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentLocation" INTEGER NOT NULL,

    CONSTRAINT "Parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelEvents" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parcelHbl" TEXT NOT NULL,
    "locationId" INTEGER,

    CONSTRAINT "ParcelEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelStatuses" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParcelStatuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parcels_hbl_key" ON "Parcels"("hbl");

-- AddForeignKey
ALTER TABLE "Parcels" ADD CONSTRAINT "Parcels_currentLocation_fkey" FOREIGN KEY ("currentLocation") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_parcelHbl_fkey" FOREIGN KEY ("parcelHbl") REFERENCES "Parcels"("hbl") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelEvents" ADD CONSTRAINT "ParcelEvents_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
