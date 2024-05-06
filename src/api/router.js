const router = require("express").Router();
const {
	events_routes,
	containers_routes,
	parcels_routes,
} = require("./Routes/routes");

router.get("/", (req, res) => {
	res.json({
		message: "CTEnvios Tracking API - 👋🌎🌍🌏",
	});
});

router.use("/parcels", parcels_routes);
router.use("/events", events_routes);
router.use("/containers", containers_routes);

module.exports = router;
