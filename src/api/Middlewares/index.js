// Import and export your middleware modules here

// Example:
// export { default as auth } from './authMiddleware';
// export { default as logger } from './loggerMiddleware';
// export { default as errorHandler } from './errorHandlerMiddleware';
exports.uploadExcel = require("./_uploadExcelMiddleware");
exports.uploadImage = require("./_uploadImageMiddleware");
exports.auth = require("./_authMiddleware");
