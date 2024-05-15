const config = require("./config");
const cloudinary = require("cloudinary").v2;
cloudinary.config(config);
const { Readable } = require("stream");
const sharp = require("sharp");

const bufferToStream = (buffer) => {
	const readable = new Readable({
		read() {
			this.push(buffer);
			this.push(null);
		},
	});
	return readable;
};
const cloudinaryService = {
	uploadImage: async (file, fileName) => {
		try {
			if (!file) throw new Error("No file provided");
			file.filename = fileName;
			const data = await sharp(file.buffer).webp({ quality: 10 }).toBuffer();
			const result = await new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ folder: "ctenvios", public_id: file.filename },
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					},
				);

				bufferToStream(data).pipe(stream);
			});

			return result.secure_url;
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	},
	removeImage: async (fileName) => {
		try {
			if (!fileName) throw new Error("No fileName provided");
			console.log(fileName);
			const result = await cloudinary.uploader.destroy(fileName);
			console.log(result);
			return result;
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	},
};

module.exports = cloudinaryService;
