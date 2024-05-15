const prisma_db = require("../Databases/Prisma/_prisma_db");
const uploadImage = require("../Middlewares/_uploadImageMiddleware");
const schemas = require("../Schemas/_schemas");
const cloudinaryService = require("../Services/cloudinary/cloudinadyService");

const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
		const { hbloc, comment, imageUrl, hbl } = req.body;

		const notes = await prisma_db.notes.create({ hbloc, comment, imageUrl });
		const updateParcel = await prisma_db.parcels.update(hbl, { hasProblem: true });

		res.send({ notes });

		//res.send(notes);
	} catch (err) {
		console.log(err);
		res.status(500).send({ error: err, message: err.message });
	}
});

router.post("/image", uploadImage, async (req, res) => {
	try {
		if (req.file === undefined) {
			return res.status(400).send("Please upload an image file");
		}

		url = await cloudinaryService.uploadImage(req.file, req.params.id);
		res.send(url);
	} catch (err) {
		console.log(err);

		res.status(500).send({ error: err, message: err.message });
	}
});

module.exports = router;
// Path: src/api/Routes/events_route.js
