const createEventFromExcelDataRow = (excelEvents, hbl) => {
	const events = [];
	let currentLocationId = 1;
	let updatedAt = null;
	let statusId = 1;

	for (const key in excelEvents) {
		switch (key) {
			case "customsDate":
				events.push({
					hbl: hbl,
					updatedAt: excelEvents[key],
					locationId: 5,
					hbloc: `${hbl}-5`,
				});
				currentLocationId = 5;
				updatedAt = excelEvents[key];
				statusId = 4;
				break;
			case "wharehouseDate":
				events.push({
					hbl: hbl,
					updatedAt: excelEvents[key],
					locationId: 6,
					hbloc: `${hbl}-6`,
				});
				currentLocationId = 6;
				updatedAt = excelEvents[key];
				statusId = 5;
				break;
			case "trucksDate":
				events.push({
					hbl: hbl,
					updatedAt: excelEvents[key],
					locationId: 7,
					hbloc: `${hbl}-7`,
				});
				currentLocationId = 7;
				updatedAt = excelEvents[key];
				statusId = 6;
				break;
			case "deliveredDate":
				events.push({
					hbl: hbl,
					updatedAt: excelEvents[key],
					locationId: 8,
					hbloc: `${hbl}-8`,
				});
				currentLocationId = 8;
				updatedAt = excelEvents[key];
				statusId = 7;
				break;
			default:
				break;
		}
	}

	return { events, currentLocationId, updatedAt, statusId };
};

module.exports = createEventFromExcelDataRow;
