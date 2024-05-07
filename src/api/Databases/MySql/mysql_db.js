const query = require("./query");

const mysql_db = {
	invoices: {
		getPackagesByInvoicesId: async (array_of_invoices_id) => {
			if (!array_of_invoices_id || array_of_invoices_id.length === 0) return [];
			return await query(
				"SELECT HBL as hbl,InvoiceId as invoiceId,ContainerId as containerId FROM `tracking` where InvoiceId IN (?);",
				[array_of_invoices_id],
			);
		},
		getInvoicesLimit: async (limit) => {
			if (!limit) return [];
			try {
				const invoicesFound = await query(
					"SELECT * FROM `tracking` order by InvoiceId DESC LIMIT ?;",
					[limit],
				);
				return invoicesFound;
			} catch (error) {
				console.log(error);
			}
		},
		getInvoiceById: async (invoiceId) => {
			try {
				const listOfHbl = await query("select * from tracking where InvoiceId=?", [invoiceId]);
				if (listOfHbl?.length === 0) return [];
				const commonData = listOfHbl[0];
				const invoice = {
					invoiceId: commonData?.InvoiceId,
					agency: commonData?.AgencyName,
					agencyId: commonData?.AgencyId,
					containerId: commonData?.ContainerId,
					containerName: commonData?.ContainerName,
					customerId: commonData?.CustomerId,
					customer: await mysqlService.customers.getCustomerById(commonData?.CustomerId),
					recieverId: commonData?.RecieverId,
					reciever: await mysqlService.recievers.getRecieverById(commonData?.RecieverId),
					packages: await Promise.all(
						listOfHbl.map(async (pack) => {
							return {
								hbl: pack?.HBL,
								weight: pack?.ProductWeight,
								description: pack?.Description,
								trackingHistory: [
									{
										location: "En Contenedor",
										createdAt: pack?.ContainerDate || null,
										container: pack?.ContainerName || null,
									},

									{
										location: "En Pallet",
										createdAt: pack?.palletDate || null,
										pallet: pack?.PalletId || null,
									},
									{
										location: "Despacho",
										createdAt: pack?.DispatchId
											? await mysqlService.dispatch.getDispatchDateById(pack.DispatchId)
											: null,
										dispatch: pack?.DispatchId || null,
									},
									{
										createdAt: pack.InvoiceDate,
										location: "Facturado",
									},
								],
							};
						}),
					),
				};

				return invoice;
			} catch (error) {
				console.log(error);
			}
		},
	},
	packages: {
		getByInvoices: async (array_of_invoices_id) => {
			if (!array_of_invoices_id || array_of_invoices_id.length === 0) return [];
			return await query(
				"SELECT HBL as hbl,InvoiceId as invoiceId FROM `parcels` where InvoiceId IN (?) ;",
				[array_of_invoices_id],
			);
		},

		getByHblArray: async (hbl_array) => {
			if (!hbl_array || hbl_array.length === 0) return [];
			return await query("SELECT HBL  FROM `parcels` where HBL IN (?) ;", [hbl_array]);
		},

		getByInvoiceId: async (invoiceId) => {
			const packages = await query("select * from parcels where InvoiceId=?", [invoiceId]);
			return packages;
		},
		getPackageByHBL: async (hbl) => {
			try {
				const packagesFound = await query("select * from parcels where HBL=?", [hbl]);
				if (packagesFound?.length === 0) return [];
				return packagesFound;
			} catch (error) {
				console.log(error);
			}
		},

		getPackagesByContainerId: async (containerId) => {
			try {
				const packagesFound = await query(
					"select * from view_reports_by_container where ContainerId=?",
					[containerId],
				);
				if (packagesFound?.length === 0) return [];
				return packagesFound;
			} catch (error) {
				console.log(error);
			}
		},

		getPackagesByHblList: async (array_of_hbls) => {
			if (!array_of_hbls || array_of_hbls.length === 0) return [];
			return await query(
				"SELECT HBL as hbl,InvoiceId as invoiceId, InvoiceDate as invoiceDate, ContainerId as containerId, ContainerDate as containerDate,  AgencyId as agencyId, Description as description, ProductWeight as weight   FROM `tracking` where HBL IN (?);",
				[array_of_hbls],
			);
		},
	},

	customers: {
		getCustomerById: async (customerId) => {
			try {
				const customer = {};
				const [result] = await query("select * from clientes where codigo=?", [customerId]);
				if (result?.length === 0) return [];
				customer.name = result?.nombre + " " + result?.nombre2;
				customer.lastName = result?.apellido + " " + result?.apellido2;
				customer.mobile = result?.cel;
				customer.phone = result?.tel;

				return customer;
			} catch (error) {
				console.log(error);
			}
		},
	},
	recievers: {
		getRecieverById: async (id) => {
			try {
				const [result] = await query("SELECT * FROM destinatarios WHERE codigo=?", [id]);
				if (result?.length === 0) return [];
				const [state] = await query("SELECT ciudad as Province FROM ciudades where id=?", [
					result.estado,
				]);
				const [city] = await query(
					"SELECT ciudad as Municipality FROM ciudades_cuba where codigo=?",
					[result.ciudad],
				);
				const reciever = {};

				reciever.name = result?.nombre + " " + result?.nombre2;
				reciever.lastName = result?.apellido + " " + result?.apellido2;
				reciever.mobile = result?.cel;
				reciever.phone = result?.tel;
				reciever.ci = result?.documento;
				reciever.passport = result?.pasaporte;
				reciever.address =
					result?.cll +
					" " +
					result?.entre_cll +
					" " +
					"No: " +
					result?.no +
					" " +
					result?.apto +
					" " +
					result?.reparto;
				reciever.province = state?.Province;
				reciever.municipality = city?.Municipality;
				return reciever;
			} catch (error) {
				console.log(error);
			}
		},
	},
	pallets: {
		getPalletById: async (id) => {
			try {
				const [result] = await query("SELECT * FROM pallets WHERE codigo=?", [id]);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
	},
	dispatch: {
		getDispatchDateById: async (id) => {
			try {
				const dispatchId = id.slice(1);
				const [result] = await query("SELECT fecha as createdAt FROM despachos WHERE codigo=?", [
					dispatchId,
				]);
				return result?.createdAt;
			} catch (error) {
				console.log(error);
			}
		},
	},
	container: {
		getContainerById: async (id) => {
			try {
				const [result] = await query(
					"select codigo as containerId, fecha as createdAt, numero as containerNumber, servicio as service, master, paquetes as packages,peso as weight from contenedores WHERE codigo=?",
					[id],
				);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
		getContainers: async () => {
			try {
				const result = await query(
					"select codigo as containerId, fecha as createdAt, numero as containerNumber, servicio as service, master, paquetes as packages,peso as weight from contenedores order by codigo DESC;",
				);
				return result;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		getPackagesByContainerId: async (id) => {
			try {
				const result = await query("select * from parcels where containerId=?", [id]);
				return result;
			} catch (error) {
				console.log(error);
			}
		},
	},
};

module.exports = mysql_db;
