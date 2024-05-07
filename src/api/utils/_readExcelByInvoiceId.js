const readXlsxFile = require("read-excel-file/node");
const schemas = require("../schemas/schemas");
const readExcelFile = async (filePath, schema) => {
	const sheets = await readXlsxFile(filePath, { getSheets: true });

	const readedData = await Promise.all(
		sheets.map(async (sheet) => {
			const rows = await readXlsxFile(filePath, {
				schema: schema,
				sheet: sheet.name,
			});
			return { sheet: sheet.name, rows: rows.rows, errors: rows.errors };
		}),
	);

	return readedData;
};

module.exports = readExcelFile;
