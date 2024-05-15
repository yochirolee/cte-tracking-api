const createEvents = (parcels, locationId, statusId, updatedAt) => {
	if (!parcels || !Array.isArray(parcels) || parcels.length === 0) {
		return [];
	}
	const events = parcels.map((parcel) => {
		return {
			hbl: parcel.hbl,
			hbloc: parcel.hbl + "-" + locationId,
			locationId: locationId,
			statusId: statusId,
			updatedAt: updatedAt,
		};
	});
	return events;
};

module.exports = createEvents;
