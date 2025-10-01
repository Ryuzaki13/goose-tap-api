import { makeAuthController } from "factories/makeAuthController";
import { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
	const authController = makeAuthController(fastify.repos.userRepo, fastify.repos.roleRepo);

	fastify.post("/login", authController.login);
	fastify.get("/me", authController.me);
}
