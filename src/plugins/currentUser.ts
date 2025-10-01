import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { UserWithRole } from "types";

const currentUserPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.decorateRequest("user", null);

	fastify.addHook("preHandler", async function (request) {
		const sessionUser = request.cookies.user;

		if (sessionUser && sessionUser !== "undefined") {
			try {
				const user = JSON.parse(sessionUser) as UserWithRole;
				request.user = user ?? null;
			} catch {
				// noop
			}
		}
	});
};

export default fp(currentUserPlugin);
