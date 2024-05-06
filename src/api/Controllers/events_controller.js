const parcel_services = require("../Services/parcel_services");

const events_controller = {
	upsertEvents: async (arrayOfHbls, currentLocationId, status) => {

		const result = await parcel_services.parcels.movePackages(
			arrayOfHbls,
			currentLocationId,
			status,
		);
		return result;
		//find the events with the hbl
		//update the events with new location and status
		//return updated events
	},
};
module.exports = events_controller;
