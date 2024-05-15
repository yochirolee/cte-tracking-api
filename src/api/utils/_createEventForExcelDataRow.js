const createEventFromExcelDataRow = (excelEvents, package) => {
	const events = [];

	for (const key in excelEvents) {
		switch (key) {
			case "customsDate":
				events.push({
					hbl: package.hbl,
					updatedAt: excelEvents[key],
					locationId: 5,
					statusId: 2,
					hbloc: `${package.hbl}-5`,
				});

				updatedAt = excelEvents[key];

				break;
			case "wharehouseDate":
				events.push({
					hbl: package.hbl,
					updatedAt: excelEvents[key],
					locationId: 6,
					hbloc: `${package.hbl}-6`,
					statusId: 2,
				});

				updatedAt = excelEvents[key];

				break;
			case "trucksDate":
				events.push({
					hbl: package.hbl,
					updatedAt: excelEvents[key],
					locationId: 7,
					statusId: 3,
					hbloc: `${package.hbl}-7`,
				});
				updatedAt = excelEvents[key];
				break;
			case "deliveredDate":
				events.push({
					hbl: package.hbl,
					updatedAt: excelEvents[key],
					locationId: 8,
					hbloc: `${package.hbl}-8`,
					statusId: 8,
				});
				updatedAt = excelEvents[key];
				break;
			default:
				break;
		}
	}

	return events;
};

module.exports = createEventFromExcelDataRow;
