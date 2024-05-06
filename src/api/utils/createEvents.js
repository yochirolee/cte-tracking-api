const createEvents = (parcels, currentLocationId, updatedAt) => {
	if (!parcels || !Array.isArray(parcels) || parcels.length === 0) {
		return [];
	}
	const events = parcels.map((parcel) => {
		return {
			hbl: parcel.hbl,
			hbloc: parcel.hbl + "-" + currentLocationId,
			locationId: currentLocationId,
			updatedAt: updatedAt ? updatedAt : new Date(),
		};
	});
	return events;
};

module.exports = createEvents;
