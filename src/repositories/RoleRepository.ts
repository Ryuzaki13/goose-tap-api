import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "./interfaces/IRoleRepository";

export class RoleRepository implements IRoleRepository {
	constructor(private prisma: PrismaClient) {}

	findByName(name: string) {
		return this.prisma.role.findUnique({ where: { name } });
	}

	create(name: string) {
		return this.prisma.role.create({ data: { name } });
	}
}
