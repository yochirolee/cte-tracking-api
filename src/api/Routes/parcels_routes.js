const prisma_db = require("../Databases/Prisma/_prisma_db");
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

router.post("/moveParcelsByContainerId", parcels_controller.moveParcelsByContainerId);

router.post("/changeLocation", parcels_controller.moveParcelByHblArray);

router.post("/excel/invoice", uploadExcel, parcels_controller.uploadExcelByInvoiceId);
router.post("/excel/hbl", uploadExcel, parcels_controller.uploadExcelByHbl);

module.exports = router;
// Path: src/api/Routes/events_route.js
