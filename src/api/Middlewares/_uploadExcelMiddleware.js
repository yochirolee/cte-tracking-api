const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "/tmp";
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		cb(null, "excel.xlsx");
	},
});

const xlsxFilter = (req, file, cb) => {
	if (file.mimetype.includes("xlsx")) {
		cb(null, true);
	} else {
		cb("Please upload only xlsx file.", false);
	}
};

function uploadExcel(req, res, next) {
	console.log("uploadExcel");
	try {
		const upload = multer({ storage: storage }).single("file");
		upload.fileFilter = xlsxFilter;
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
}

module.exports = uploadExcel;
