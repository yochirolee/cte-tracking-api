const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const locations = [
	{ name: "En Agencia" },
	{ name: "En Almacen" },
	{ name: "En Contenedor" },
	{ name: "En Puerto del Mariel" },
	{ name: "Aduana Cuba" },
	{ name: "Almacen Cuba" },
	{ name: "En Traslado" },
	{ name: "Destino Final" },
];

const status = [
	{
		status: "Facturado",
		description: "En agencia de origen",
	},
	{
		status: "En Espera",
		description: "En agencia de origen",
	},
	{
		status: "En Transito",
		description: "Su paquete esta en camino",
	},
	{
		status: "En Canal Rojo",
		description: "Su paquete esta en canal rojo",
	},
	{
		status: "Roto",
		description: "Su paquete esta roto",
	},
	{
		status: "Mojado",
		description: "Su paquete esta mojado",
	},
	{
		status: "Perdido",
		description: "Su paquete esta perdido",
	},
	{
		status: "Entregado",
		description: "Su paquete esta entregado",
	},
];

async function main() {
	console.log(`Start seeding ...`);

	for (const l of locations) {
		const location = await prisma.locations.create({
			data: l,
		});
		console.log(`Created location with id: ${location.id}`);
	}

	for (const s of status) {
		const status = await prisma.status.create({
			data: s,
		});
		console.log(`Created status with id: ${status.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
