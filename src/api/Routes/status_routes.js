const router = require("express").Router();
const prisma_db = require("../Databases/Prisma/_prisma_db");


router.get("/",async (req, res) => {
	const status =await prisma_db.status.get();
	res.json(status);
});

module.exports = router;
// Path: src/api/Routes/events_route.js
