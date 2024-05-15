const Joi = require("joi");

const schemas = {
	noteSchema: Joi.object({
		hbloc: Joi.string().required(),
		comment: Joi.string().required().min(1).max(255),
		imageUrl: Joi.string().uri(),
		
	}),
	eventSchema: Joi.object({
		hbl: Joi.number().required(),
		locationId: Joi.number().required(),
		status: Joi.string().required(),
		createdAt: Joi.date().required(),
		createdBy: Joi.string().required(),
	}),
	excelSchemaByInvoiceId: {
		FACTURA: {
			prop: "invoiceId",
			type: Number,
		},
		F_ENTRADA: {
			prop: "customsDate",
			type: Date,
		},
		F_AFORO: {
			prop: "wharehouseDate",
			type: Date,
		},
		F_SALIDA: {
			prop: "trucksDate",
			type: Date,
		},
		F_ENTREGA: {
			prop: "deliveredDate",
			type: Date,
		},
	},
	excelSchemaByHBL: {
		HBL: {
			prop: "hbl",
			type: String,
		},
		F_ENTRADA: {
			prop: "customsDate",
			type: Date,
		},
		F_AFORO: {
			prop: "wharehouseDate",
			type: Date,
		},
		F_SALIDA: {
			prop: "trucksDate",
			type: Date,
		},
		F_ENTREGA: {
			prop: "deliveredDate",
			type: Date,
		},
	},
};

module.exports = schemas;
