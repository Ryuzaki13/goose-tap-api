import { makeRoundController } from "factories/makeRoundController";
import { FastifyInstance } from "fastify";

export default async function roundRoutes(fastify: FastifyInstance) {
	const roundController = makeRoundController(fastify.prisma);

	fastify.post("/", roundController.createRound);
	fastify.get("/", roundController.getAllRounds);
	fastify.get("/:roundId", roundController.getRound);
	fastify.post("/tap", roundController.tap);
}
