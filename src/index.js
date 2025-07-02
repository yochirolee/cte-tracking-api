const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const router_v1 = require("./api/router");
const compression = require("compression");
const authByApiKey = require("./api/Middlewares/_authMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", authByApiKey, router_v1);

app.all("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
