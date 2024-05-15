-- CreateTable
CREATE TABLE "Parcels" (
    "hbl" TEXT NOT NULL,
    "containerId" INTEGER,
    "invoiceId" INTEGER NOT NULL,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "isSenderNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Parcels_pkey" PRIMARY KEY ("hbl")
);

-- CreateTable
CREATE TABLE "Events" (
    "hbloc" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hbl" TEXT NOT NULL,
    "locationId" INTEGER,
    "statusId" INTEGER,
    "detailsId" INTEGER,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("hbloc")
);

-- CreateTable
CREATE TABLE "EventDetails" (
    "id" SERIAL NOT NULL,
    "images" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "EventDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parcels_hbl_key" ON "Parcels"("hbl");

-- CreateIndex
CREATE UNIQUE INDEX "Events_hbloc_key" ON "Events"("hbloc");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_hbl_fkey" FOREIGN KEY ("hbl") REFERENCES "Parcels"("hbl") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "EventDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
