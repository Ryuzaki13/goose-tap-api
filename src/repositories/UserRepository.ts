import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
	constructor(private prisma: PrismaClient) {}

	find(username: string) {
		return this.prisma.user.findMany({ where: { username } });
	}

	create(username: string, hashedPassword: string, roleId: number) {
		return this.prisma.user.create({
			data: { username, password: hashedPassword, roleId }
		});
	}

	findById(id: number) {
		return this.prisma.user.findUnique({ where: { id }, include: { role: true } });
	}
}
