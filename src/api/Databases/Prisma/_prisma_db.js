const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const prisma_db = {
	parcels: {
		get: async () => {
			try {
				const parcels = await prisma.parcels.findMany({
					orderBy: {
						createdAt: "desc",
					},
					take: 100,
				});
				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},

		getByHbl: async (hbl) => {
			try {
				const parcel = await prisma.parcels.findMany({
					where: { hbl: hbl },
					include: {
						location: true,
						events: {
							include: {
								locations: true,
							},
							orderBy: {
								locationId: "asc",
							},
						},
					},
				});
				return parcel;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		getByInvoiceId: async (invoiceId) => {
			try {
				const parcels = await prisma.parcels.findMany({
					where: { invoiceId: Number(invoiceId) },
					include: {
						location: true,
						events: {
							include: {
								locations: true,
							},
							orderBy: {
								locationId: "asc",
							},
						},
					},
				});

				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},

		getByContainerId: async (containerId) => {
			try {
				const parcels = await prisma.parcels.findMany({
					where: {
						containerId: Number(containerId),
					},
					include: {
						location: true,
						events: true,
					},
				});
				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		getByHblList: async (hblList) => {
			try {
				const parcels = await prisma.parcels.findMany({
					where: {
						hbl: {
							in: hblList,
						},
					},
					include: {
						location: true,
						status: true,
					},
				});
				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		getByHblListWithEvents: async (hblList) => {
			try {
				const parcels = await prisma.parcels.findMany({
					where: {
						hbl: {
							in: hblList,
						},
					},
					include: {
						location: true,
						status: true,
						events: {
							include: {
								locations: true,
							},
							orderBy: {
								locationId: "asc",
							},
						},
					},
				});
				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},

		/* 	updateMany: async (parcels, currentLocationId, status) => {
			try {
				const updatedParcels = await prisma.parcels.updateMany({
					where: {
						hbl: {
							in: parcels.map((parcel) => parcel.hbl),
						},
					},
					data: {
						status: status,
						currentLocation: currentLocationId,
						updatedAt: new Date(),
					},
				});
				console.log(updatedParcels, "updated parcels");
				return updatedParcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		}, */
	},
	events: {
		get: async () => {
			try {
				const events = await prisma.events.findMany({
					orderBy: {
						createdAt: "desc",
					},
					take: 100,
				});
				return events;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		upsert: async (data) => {
			try {
				const events = await prisma.events.upsert({
					where: { hbl: data.hbl },
					update: data,
					create: data,
				});
				return events;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
	},
};

module.exports = prisma_db;
