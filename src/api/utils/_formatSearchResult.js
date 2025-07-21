const toCamelCase = require("./_toCamelCase");

const formatedJoin = (parcels, packages) => {
	// Create a Map for quick lookup by `hbl`
	const unionByHbl = packages.map((pack) => {
		const parcel = parcels.find((parcel) => pack.hbl === parcel.hbl);

		return {
			invoiceId: pack.invoiceId,
			hbl: pack.hbl,
			sender: toCamelCase(pack.sender),
			receiver: toCamelCase(pack.receiver),
			description: toCamelCase(pack.description),
			weight: pack.weight,
			province: pack.province,
			agency: toCamelCase(pack.agency),
			city: pack.city,

			receiverPhone: pack.receiverPhone,
			senderPhone: pack.senderPhone,
			shippingAddress:
				toCamelCase(pack?.cll + " " + pack?.entre_cll + " " + pack.no + " " + pack?.apto) +
				" " +
				pack?.reparto,
			currentLocationId:
				parcel?.events?.length > 0 ? parcel?.events[parcel?.events?.length - 1]?.locationId : 3,
			events: parcel?.events ? parcel.events : createResultEvents(pack, parcel),

			//max locationId
		};
	});

	return unionByHbl;
};
const createResultEvents = (package, parcel) => {
	if (!package) return [];
	const events = [];
	if (package?.invoiceDate) {
		events.push({
			locationId: 1,
			updatedAt: package?.invoiceDate,
			location: "Facturado en Agencia",
		});

		if (package?.palletDate) {
			events.push({
				locationId: 2,
				updatedAt: package?.palletDate,
				location: "En Pallet " + package?.palletId,
			});
		}

		if (package?.containerDate) {
			events.push({
				locationId: 3,
				updatedAt: package?.containerDate,
				location: "En Contenedor " + package?.containerName,
			});
		}

		if (parcel?.events?.length > 0) {
			parcel.events.map((event) => {
				events.push({
					locationId: event.locationId,
					updatedAt: event.updatedAt,
					location: event.locations?.name,
				});
			});
		}
	}
	return events;
};
const formatSearchResult = (parcels, packages) => {
	// Create a Map for quick lookup by `hbl`

	const formatedResult = {
		invoiceId: packages[0].invoiceId,
		customer: {
			fullName: toCamelCase(packages[0].sender),
			mobile: packages[0].senderMobile,
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
const littleFormatSearchResult = (parcels, packages) => {
	// Create a Map for quick lookup by `hbl`

	const formatedResult = {
		invoiceId: packages[0].invoiceId,
		agency: toCamelCase(packages[0].agency),
		province: packages[0].province,
		city: packages[0].city,

		parcels: packages.map((package) => {
			const parcelMap = new Map(parcels.map((parcel) => [parcel.hbl, parcel]));
			const parcel = parcelMap.get(package.hbl);

			return {
				hbl: package.hbl,
				weight: package.weight,
				description: toCamelCase(package.description),
				location: parcel ? parcel?.location?.name : "En Contenedor",
				events: createResultEvents(package, parcel),
			};
		}),
	};

	return formatedResult;
};

module.exports = { formatedJoin, formatSearchResult, littleFormatSearchResult };
