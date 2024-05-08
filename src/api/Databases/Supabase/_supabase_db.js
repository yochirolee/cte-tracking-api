const supabase = require("./config");

const supabase_db = {
	parcels: {
		upsertParcels: async (parcels) => {
			return await supabase.from("Parcels").upsert(parcels, { onConflict: "hbl" }).select("*");
		},

		getParcelByArrayOfHbls: async (arrayOfHbls) => {
			return await supabase.from("Parcels").select("*").in("hbl", arrayOfHbls);
		},
	},
	parcelEvents: {
		upsertParcelEvents: async (events) => {
			return await supabase.from("Events").upsert(events, { onConflict: "hbloc" }).select("*");
		},
	},
};
module.exports = supabase_db;
