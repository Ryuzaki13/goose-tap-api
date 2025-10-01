import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const prisma = new PrismaClient();

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.decorate("prisma", prisma);

	fastify.addHook("onClose", function (_, done) {
		prisma.$disconnect();
		done();
	});
};

// Оборачиваем в fp, чтобы гарантировать корректное поведение
export default fp(prismaPlugin);
