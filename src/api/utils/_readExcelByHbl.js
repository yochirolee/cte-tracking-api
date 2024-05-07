const readXlsxFile = require("read-excel-file/node");
const schemas = require("../schemas/schemas");
const readExcelFileByHBL = async (filePath) => {
	const sheets = await readXlsxFile(filePath, { getSheets: true });
	const readedData = await Promise.all(
		sheets.map(async (sheet) => {
			const rows = await readXlsxFile(filePath, {
				schema: schemas.excelSchemaByHBL,
				sheet: sheet.name,
			});
			return { sheet: sheet.name, rows: rows.rows, errors: rows.errors };
		}),
	);

	return readedData;
};

module.exports = readExcelFileByHBL;
