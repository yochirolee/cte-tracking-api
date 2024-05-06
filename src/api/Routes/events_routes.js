
const router = require("express").Router();

router.get("/", (req, res) => {
	res.json({ message: "Events route" });
});

module.exports = router;
// Path: src/api/Routes/events_route.js
