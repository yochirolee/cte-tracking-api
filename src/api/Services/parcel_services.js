const mysql_db = require("../Databases/MySql/mysql_db");
const prisma_db = require("../Databases/Prisma/prisma_db");
const supabase_db = require("../Databases/Supabase/supabase_db");
const createEvents = require("../utils/createEvents");
const formatPackages = require("../utils/formatPackages");
const { formatedJoin } = require("../utils/formatSearchResult");

const parcel_services = {
	containers: {
		//Move al packages in container to Mariel Port
		movePackagesInContainerToPort: async (containerId) => {
			const container = await mysql_db.container.getContainerById(containerId);
			if (!container) {
				throw new Error("Container not found");
			}
			const packages = await mysql_db.container.getPackagesByContainerId(containerId);
			if (packages.length === 0) {
				throw new Error("No packages found for this container");
			}
			const currentLocation = 4;
			const updatedPackages = formatPackages(packages, currentLocation, "En Espera");
			const { data, error } = await supabase_db.parcels.upsertParcels(updatedPackages);
			if (error) {
				throw new Error({ message: "Error updating or creating packages", error });
			}
			//create Events from inserted packages
			const events = createEvents(updatedPackages, currentLocation);

			const { data: eventsData, error: eventsError } =
				await supabase_db.parcelEvents.upsertParcelEvents(events);
			if (eventsError) {
				throw new Error({ message: "Error updating or  creating events", error: eventsError });
			}
			return data;
		},
	},
	parcels: {
		toPort: async (containerId, updatedAt) => {
			const container = await mysql_db.container.getContainerById(containerId);
			if (!container) {
				throw new Error("Container not found");
			}
			const packages = await mysql_db.container.getPackagesByContainerId(containerId);
			if (packages.length === 0) {
				return { message: "No packages found for this container" };
			}
			const currentLocationId = 4;
			const updatedPackages = formatPackages(packages, currentLocationId, "En Espera", updatedAt);
			const { data, error } = await supabase_db.parcels.upsertParcels(updatedPackages);
			if (error) {
				console.log(error);
				throw new Error({ message: "Error updating or creating packages", ...error });
			}
			//create Events from inserted packages
			const events = createEvents(updatedPackages, currentLocationId, updatedAt);

			const { data: eventsData, error: eventsError } =
				await supabase_db.parcelEvents.upsertParcelEvents(events);
			if (eventsError) {
				throw new Error({ message: "Error updating or  creating events", error: eventsError });
			}
			return data;
		},
		changeLocation: async (arrayOfHbls, currentLocationId, statusId, updatedAt) => {
			const { data: parcels, error } = await supabase_db.parcels.getParcelByArrayOfHbls(
				arrayOfHbls,
			);
			if (error) {
				return { message: "Error finding packages", error };
			}
			if (parcels.length === 0) {
				return { message: "No parcels found" };
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
				return { message: "Error updating packages", error: updateError };
			}
			//create Events from inserted packages
			const events = createEvents(updatedParcels, currentLocationId, updatedAt);
			const { data: eventsData, error: eventsError } =
				await supabase_db.parcelEvents.upsertParcelEvents(events);
			if (eventsError) {
				return { message: "Error creating events", error: eventsError };
			}
			return updatedParcelsData;
		},
		getParcelsInfoByContainerId: async (containerId) => {
			const [packages, parcels] = await Promise.all([
				mysql_db.container.getPackagesByContainerId(containerId),
				prisma_db.parcels.getByContainerId(containerId),
			]);
			if (packages?.length === 0) {
				throw new Error({
					message: "No packages found for this container",
					hint: "Check the container ID",
				});
			}

			const unionByHbl = formatedJoin(parcels, packages);

			const containerData = {
				inPort: !!parcels?.length > 0,
				data: unionByHbl,
			};

			return containerData;
		},
	},
};
module.exports = parcel_services;
