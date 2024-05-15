const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const locations = [
	{ name: "En Agencia" },
	{ name: "En Almacen" },
	{ name: "En Contenedor" },
	{ name: "En Puerto del Mariel" },
	{ name: "Aduana Cuba" },
	{ name: "Almacen Mypimes" },
	{ name: "En Traslado" },
	{ name: "Entregado" },
];

const status = [
	{
		name: "Facturado",
		description: "En agencia de origen",
	},
	{
		name: "En Espera",
		description: "En agencia de origen",
	},
	{
		name: "En Transito",
		description: "Su paquete esta en camino",
	},
	{
		name: "En Canal Rojo",
		description: "Su paquete esta en canal rojo",
	},
	{
		name: "En Proceso",
		description: "Su paquete esta siendo procesado",
	},
	{
		name: "Roto",
		description: "Su paquete esta roto",
	},
	{
		name: "Mojado",
		description: "Su paquete esta mojado",
	},
	{
		name: "Perdido",
		description: "Su paquete esta perdido",
	},
	{
		name: "Entregado",
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
