import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	await prisma.role.createMany({
		data: [{ name: "admin" }, { name: "nikita" }, { name: "other" }],
		skipDuplicates: true
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
