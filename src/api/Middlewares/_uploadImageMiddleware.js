const multer = require("multer");
const storage = multer.memoryStorage();

const uploadImage = (req, res, next) => {
	try {
		const upload = multer({ storage: storage }).single("image");
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				return res.status(500).json(err);
			} else if (err) {
				return res.status(500).json(err);
			}
			next();
		});
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

module.exports = uploadImage;
