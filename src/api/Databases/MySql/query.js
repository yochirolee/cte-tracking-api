const mysql = require("mysql2/promise");
const config = require("./config.js");
const pool = mysql.createPool(config);

const query = async (sql, params = []) => {
	try {
		const [rows] = await pool.query(sql, params);
		return rows;
	} catch (error) {
		throw error;
	}
};

module.exports = query;
