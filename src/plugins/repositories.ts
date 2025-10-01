import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { RoleRepository } from "../repositories/RoleRepository";
import { UserRepository } from "../repositories/UserRepository";

const repositoriesPlugin: FastifyPluginAsync = async (fastify) => {
	const userRepo = new UserRepository(fastify.prisma);
	const roleRepo = new RoleRepository(fastify.prisma);

	fastify.decorate("repos", { userRepo, roleRepo });
};

export default fp(repositoriesPlugin);
