const dotenv = require("dotenv");
dotenv.config();

const authByApiKey = (req, res, next) => {
	const apiKey = req.headers["api-key"];

	if (!apiKey) return res.status(401).json({ error: "API Key is required" });
	if (apiKey !== process.env.API_KEY) return res.status(401).json({ error: "Invalid API Key" });
	next();
};

module.exports = authByApiKey;
