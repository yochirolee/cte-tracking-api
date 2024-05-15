const router = require("express").Router();
const prisma_db = require("../Databases/Prisma/_prisma_db");


router.get("/",async (req, res) => {
	const locations =await prisma_db.locations.get();
	res.json(locations);
});

module.exports = router;
// Path: src/api/Routes/events_route.js
