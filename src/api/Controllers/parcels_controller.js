const mysql_db = require("../Databases/MySql/_mysql_db");
const prisma_db = require("../Databases/Prisma/_prisma_db");
const supabase_db = require("../Databases/Supabase/_supabase_db");
const createEvents = require("../utils/_createEvents");
const formatPackages = require("../utils/_formatPackages");
const { formatedJoin, formatSearchResult } = require("../utils/_formatSearchResult");
const createEventFromExcelDataRow = require("../utils/_createEventForExcelDataRow");
const schemas = require("../Schemas/_schemas");

const parcels_controller = {
	getByHbl: async (req, res) => {
		const hbl = req.params.id;
		if (!hbl) {
			return res.status(400).json({ message: "Parcel ID is required" });
		}

		const [packages, parcels] = await Promise.all([
			mysql_db.packages.getPackageByHBL(hbl),
			prisma_db.parcels.getByHbl(hbl),
		]);
		if (!packages?.length) return res.status(404).json({ message: "Parcel not found" });

		const result = formatSearchResult(parcels, packages);

		res.send(result);
	},
	getByInvoiceId: async (req, res) => {
		const invoiceId = req.params.id;
		if (!invoiceId) {
			return res.status(400).json({ message: "Invoice ID is required" });
		}
		if (isNaN(invoiceId) || !Number(invoiceId)) {
			return res.status(400).json({ message: "Invoice ID must be a number" });
		}

		const packages = await mysql_db.packages.getByInvoiceId(invoiceId);
		const parcels = await prisma_db.parcels.getByHblListWithEvents(
			packages.map((parcel) => parcel.hbl),
		);
		//group invoice by invoiceId
		const result = formatSearchResult(parcels, packages);
		res.send(result);
	},

	getParcelsByContainerId: async (req, res) => {
		const containerId = req.params.id;
		if (!containerId) {
			return res.status(400).json({ message: "container Id is required" });
		}
		const packages = await mysql_db.container.getPackagesByContainerId(containerId);

		if (!packages) return res.status(404).json({ message: "No packages found for this container" });

		const hbl_list = packages.map((parcel) => parcel.hbl);

		const parcels = await prisma_db.parcels.getByHblList(hbl_list);
		const unionByHbl = formatedJoin(parcels, packages);

		const containerData = {
			inPort: !!parcels?.length > 0,
			data: unionByHbl,
		};
		res.send(containerData);
	},
	moveParcelsToPort: async (req, res) => {
		const { containerId, updatedAt } = req.body;
		if (!containerId) {
			return res.status(400).json({ message: "container Id is required" });
		}
		const packages = await mysql_db.container.getPackagesByContainerId(containerId);
		if (packages.length === 0) {
			return res.status(301).json({ message: "No packages found for this container" });
		}
		const currentLocationId = 4;
		const statusId = 1;
		const updatedPackages = formatPackages(packages, currentLocationId, statusId, updatedAt);
		const { data, error } = await supabase_db.parcels.upsertParcels(updatedPackages);
		if (error) {
			return res.status(500).json({ message: "Error updating or creating packages", error });
		}
		//create Events from inserted packages
		const events = createEvents(updatedPackages, currentLocationId);

		const { data: eventsData, error: eventsError } =
			await supabase_db.parcelEvents.upsertParcelEvents(events);
		if (eventsError) {
			return res
				.status(500)
				.json({ message: "Error updating or  creating events", error: eventsError });
		}
		res.send(data);
	},
	changeLocation: async (req, res) => {
		const { hbl_array, currentLocationId, statusId, updatedAt } = req.body;
		if (!hbl_array || !currentLocationId || !statusId) {
			return res
				.status(400)
				.json({ message: "arrayOfHbls, currentLocationId and statusId are required" });
		}

		const { data: parcels, error } = await supabase_db.parcels.getParcelByArrayOfHbls(hbl_array);
		if (error) {
			res.status(301).json({ message: "Error finding packages", error });
		}
		if (parcels.length === 0) {
			res.status(301).json({ message: "No parcels found" });
		}

		const updatedParcels = parcels.map((parcel) => {
			return {
				...parcel,
				currentLocationId: currentLocationId,
				statusId: statusId,
				updatedAt: updatedAt ? updatedAt : new Date(),
			};
		});

		const { data: updatedParcelsData, error: updateError } =
			await supabase_db.parcels.upsertParcels(updatedParcels);
		if (updateError) {
			res.status(500).json({ message: "Error updating packages", error: updateError });
		}
		//create Events from inserted packages
		const events = createEvents(updatedParcels, currentLocationId, updatedAt);
		const { data: eventsData, error: eventsError } =
			await supabase_db.parcelEvents.upsertParcelEvents(events);
		if (eventsError) {
			res.status(500).json({ message: "Error updating or  creating events", error: eventsError });
		}
		res.json(updatedParcelsData);
	},

	uploadExcelByHbl: async (req, res) => {
		const filePath = req.file.path;
		const readExcelFile = require("../utils/_readExcelFile");
		const excelData = await readExcelFile(filePath, schemas.excelSchemaByHBL);

		//get sheet names
		//for every sheet, get the data
		//get the data from the sheet
		const sheets = Object.keys(excelData);

		const result = await Promise.all(
			sheets.map(async (sheetNumber) => {
				const sheetData = excelData[sheetNumber];

				if (!sheetData)
					return res.status(500).send("Error reading excel file no sheet data found.");
				const { rows, errors, sheet } = sheetData;
				//return { sheet, rows, errors };

				const hbl_array = rows.map((pack) => pack.hbl);

				const existingPackages = await mysql_db.packages.getByHblArray(hbl_array);

				const createdParcelData = [];
				existingPackages.forEach((pack) => {
					const row = rows.find((row) => row.hbl === pack.hbl);

					const { currentLocationId, updatedAt, events, statusId } = createEventFromExcelDataRow(
						row,
						pack.hbl,
					);

					if (currentLocationId > 1) {
						createdParcelData.push({
							...pack,
							currentLocationId,
							statusId,
							updatedAt: updatedAt,
							events,
						});
					}
				});

				const parcels = createdParcelData.map((parcel) => {
					return {
						hbl: parcel.hbl,
						currentLocationId: parcel.currentLocationId,
						statusId: parcel.statusId,
						updatedAt: parcel.updatedAt,
					};
				});

				const events = createdParcelData.flatMap((parcel) => parcel.events);

				const { data: parcelsUpserted, error: parcelUpsertingErrors } =
					await supabase_db.parcels.upsertParcels(parcels);
				const { data: eventsUpserted, error: eventsUpsertingError } =
					await supabase_db.parcelEvents.upsertParcelEvents(events);

				return {
					sheet,
					updated: parcelsUpserted?.length,
					events: eventsUpserted?.length,
					errors: { errors, parcelUpsertingErrors, eventsUpsertingError },
				};
			}),
		);
		res.send(result);
	},
	uploadExcelByInvoiceId: async (req, res) => {
		try {
			const filePath = req.file.path;
			const readExcelFile = require("../utils/_readExcelFile");
			const excelData = await readExcelFile(filePath, schemas.excelSchemaByInvoiceId);

			//get sheet names
			//for every sheet, get the data
			//get the data from the sheet
			const sheets = Object.keys(excelData);

			const result = await Promise.all(
				sheets.map(async (sheetNumber) => {
					const sheetData = excelData[sheetNumber];

					if (!sheetData)
						return res.status(500).send("Error reading excel file no sheet data found.");
					const { rows, errors, sheet } = sheetData;
					//return { sheet, rows, errors };

					const uniqueInvoicesId = new Set(
						rows.map((invoice) => invoice.invoiceId).filter((id) => id !== null && Number(id)),
					);
					const existingPackages = await mysql_db.packages.getByInvoices([...uniqueInvoicesId]);

					const createdParcelData = [];
					existingPackages.forEach((pack) => {
						const row = rows.find((row) => row.invoiceId === pack.invoiceId);

						const { currentLocationId, updatedAt, events, statusId } = createEventFromExcelDataRow(
							row,
							pack.hbl,
						);

						if (currentLocationId > 1) {
							createdParcelData.push({
								...pack,
								currentLocationId,
								statusId,
								updatedAt: updatedAt,
								events,
							});
						}
					});
					const parcels = createdParcelData.map((parcel) => {
						return {
							hbl: parcel.hbl,
							currentLocationId: parcel.currentLocationId,
							statusId: parcel.statusId,
							updatedAt: parcel.updatedAt,
						};
					});

					const events = createdParcelData.flatMap((parcel) => parcel.events);

					const { data: parcelsUpserted, error: parcelUpsertingErrors } =
						await supabase_db.parcels.upsertParcels(parcels);
					const { data: eventsUpserted, error: eventsUpsertingError } =
						await supabase_db.parcelEvents.upsertParcelEvents(events);

					return {
						sheet,
						updated: parcelsUpserted?.length,
						events: eventsUpserted?.length,
						errors: { errors, parcelUpsertingErrors, eventsUpsertingError },
					};
				}),
			);
			res.send(result);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	},
};

module.exports = parcels_controller;
