const prisma_db = require("../Databases/Prisma/_prisma_db");

const router = require("express").Router();

router.get("/hbl/:hbl", async (req, res) => {
	try {
		if (!req.params.hbl) return res.status(400).send("hbl is required");
		const events = await prisma_db.events.getByHBL(req.params.hbl);
		res.send(events);
	} catch (err) {
		console.log(err);
		res.status(500).send({ error: err, message: err.message });
	}
});

module.exports = router;
// Path: src/api/Routes/events_route.js
