import { PrismaClient } from "@prisma/client";
import "fastify";
import { IRoleRepository } from "../repositories/interfaces/IRoleRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserWithRole } from "./index";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
		repos: {
			userRepo: IUserRepository;
			roleRepo: IRoleRepository;
		};
	}
	interface FastifyRequest {
		user: UserWithRole | null;
	}
}
