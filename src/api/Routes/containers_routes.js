const mysql_db = require("../Databases/MySql/_mysql_db");

const router = require("express").Router();

router.get("/", async (req, res) => {
	const containers = await mysql_db.container.getContainers();
	res.json(containers);
});

router.get("/:id", async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ message: "Container ID is required" });
	}
	const container = await mysql_db.container.getContainerById(req.params.id);
	res.json(container);
});

module.exports = router;
