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
						events: {
							include: {
								locations: {
									select: {
										id: true,
										name: true,
									},
								},
								notes: true,
								status: {
									select: {
										id: true,
										name: true,
									},
								},
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
					select: {
						hbl: true,
						invoiceId: true,
						events: {
							select: {
								locationId: true,
								updatedAt: true,
								locations: {
									select: {
										name: true,
									},
								},
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
						events: {
							include: {
								locations: true,
								status: true,
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
		update: async (hbl, data) => {
			try {
				const parcels = await prisma.parcels.update({
					where: { hbl: hbl },
					data: data,
				});
				return parcels;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
	},
	events: {
		getByHBL: async (hbl) => {
			try {
				const events = await prisma.parcels.findFirst({
					where: { hbl: hbl },
					select: {
						hbl: true,
						events: {
							include: {
								locations: true,
								notes: true,
							},
							orderBy: {
								locationId: "asc",
							},
						},
					},
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
	locations: {
		get: async () => {
			try {
				const locations = await prisma.locations.findMany({
					orderBy: {
						updatedAt: "desc",
					},
					///greater than 4
					where: {
						id: {
							gt: 3,
						},
					},
				});
				return locations;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
	},
	status: {
		get: async () => {
			try {
				const allStatus = await prisma.status.findMany({
					orderBy: {
						updatedAt: "desc",
					},
				});
				return allStatus;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
	},
	notes: {
		create: async (data) => {
			try {
				const note = await prisma.notes.create({
					data: data,
				});

				return note;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		delete: async (id) => {
			try {
				const note = await prisma.notes.delete({
					where: { id: Number(id) },
				});
				return note;
			} catch (error) {
				console.log(error);
			}
		},
	},
};

module.exports = prisma_db;
