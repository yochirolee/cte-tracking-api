const router = require("express").Router();
const { statuses, status } = require("./Databases/Prisma/_prisma_db");
const {
	events_routes,
	containers_routes,
	parcels_routes,
	locations_routes,
	status_routes,
	notes_routes,
} = require("./Routes/routes");

router.get("/", (req, res) => {
	res.json({
		message: "CTEnvios Tracking API - 👋🌎🌍🌏",
	});
});

router.use("/parcels", parcels_routes);
router.use("/events", events_routes);
router.use("/containers", containers_routes);
router.use("/locations", locations_routes);
router.use("/status", status_routes);
router.use("/notes", notes_routes);

module.exports = router;
