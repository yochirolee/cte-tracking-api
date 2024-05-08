const prisma_db = require("../Databases/Prisma/_prisma_db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const parcels_controller = require("../Controllers/parcels_controller");
const uploadExcel = require("../Middlewares/_uploadExcelMiddleware");

const router = require("express").Router();

router.get("/", async (req, res) => {
	const parcels = await prisma_db.parcels.get();
	res.json(parcels);
});

router.get("/hbl/:id", parcels_controller.getByHbl);

router.get("/invoice/:id", parcels_controller.getByInvoiceId);

router.get("/container/:id", parcels_controller.getParcelsByContainerId);

router.post("/toPort", parcels_controller.moveParcelsToPort);

router.post("/changeLocation", parcels_controller.changeLocation);

router.post("/excel/invoice", uploadExcel, parcels_controller.uploadExcelByInvoiceId);
router.post("/excel/hbl", uploadExcel, parcels_controller.uploadExcelByHbl);

router.get("/create", async (req, res) => {
	const bulkWithDetails = await prisma.parcels.upsert({
		data: [
			{
				hbl: "CTE230124128502",
				invoiceId: 12352,
				containerId: 684,
				description: "Bulk Shipment 3",
				weight: 75.0,
				statusId: 1,
				currentLocation: 4,
			},
			{
				hbl: "CTE230124128503",
				invoiceId: 12353,
				containerId: 685,
				description: "Bulk Shipment 4",
				weight: 85.0,
				statusId: 1,
				currentLocation: 5,
			},
		],
	});
	res.json(bulkWithDetails);
});

module.exports = router;
// Path: src/api/Routes/events_route.js
