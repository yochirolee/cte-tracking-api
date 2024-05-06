const toCamelCase = require("./toCamelCase");

const formatedJoin = (parcels, packages) => {
	// Create a Map for quick lookup by `hbl`
	const parcelMap = new Map(parcels.map((parcel) => [parcel.hbl, parcel]));

	const unionByHbl = packages.map((package) => {
		const parcel = parcelMap.get(package.hbl);

		const basePackage = {
			invoiceId: package.invoiceId,
			description: toCamelCase(package.description),
			sender: toCamelCase(package.sender),
			receiver: toCamelCase(package.receiver),
			weight: package.weight,
			province: package.province,
			city: package.city,
			receiverPhone: package.receiverPhone,
			senderPhone: package.senderPhone,
			shippingAddress:
				toCamelCase(
					package?.cll + " " + package?.entre_cll + " " + package.no + " " + package?.apto,
				) +
				" " +
				package?.reparto,
		};

		if (parcel) {
			// If parcel exists, merge it with the additional properties from the package
			return {
				...parcel,
				...basePackage, // Merge the common properties
			};
		} else {
			// If parcel does not exist, create a new one with default properties
			return {
				hbl: package.hbl,
				invoiceId: package.invoiceId,
				containerId: package.containerId,
				statusId: 3,
				status: "En Contenedor",
				location: "En Contenedor",
				currentLocationId: 3,
				...basePackage, // Merge the common properties
			};
		}
	});
	return unionByHbl;
};
const createResultEvents = (package, parcel) => {
	const events = [];
	if (package?.invoiceDate) {
		events.push({
			locationId: 1,
			location: "Facturado",
			createdAt: package?.invoiceDate,
		});
		if (package?.dispatchId) {
			events.push({
				location: "Despacho",
				locationId: 2,
				createdAt: package?.dispatchId,
				dispatch: package?.dispatchId,
			});
		}

		if (package?.palletDate) {
			events.push({
				location: "En Pallet",
				locationId: 2,
				createdAt: package?.palletDate,
				pallet: package?.palletId,
			});
		}

		if (package?.containerDate) {
			events.push({
				location: "En Contenedor " + package?.containerName,
				locationId: 3,
				createdAt: package?.containerDate,
				container: package?.containerName,
			});
		}

		if (parcel?.events?.length > 0) events.push(...parcel.events);
	}
	return events;
};
const formatSearchResult = (parcels, packages) => {
	// Create a Map for quick lookup by `hbl`

	const formatedResult = {
		invoiceId: packages[0].invoiceId,
		customer: {
			fullName: toCamelCase(packages[0].sender),
		},
		receiver: {
			fullName: toCamelCase(packages[0].receiver),
			mobile: packages[0].receiverMobile,
			ci: packages[0].receiverCi,
		},
		agency: toCamelCase(packages[0].agency),
		province: packages[0].province,
		city: packages[0].city,

		shippingAddress: toCamelCase(
			packages[0]?.cll +
				" " +
				packages[0]?.entre_cll +
				" " +
				packages[0].no +
				" " +
				packages[0]?.apto,
			+" " + packages[0]?.reparto,
		),

		parcels: packages.map((package) => {
			const parcelMap = new Map(parcels.map((parcel) => [parcel.hbl, parcel]));
			const parcel = parcelMap.get(package.hbl);

			return {
				hbl: package.hbl,
				weight: package.weight,
				description: toCamelCase(package.description),
				location: parcel ? parcel?.location?.name : "En Contenedor",
				status: parcel ? parcel?.status?.status : "En Contenedor",
				events: createResultEvents(package, parcel),
			};
		}),
	};

	return formatedResult;
};

module.exports = { formatedJoin, formatSearchResult };
