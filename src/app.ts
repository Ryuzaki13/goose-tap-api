import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastify from "fastify";
import currentUserPlugin from "plugins/currentUser";
import repositoriesPlugin from "plugins/repositories";
import prismaPlugin from "./plugins/prisma";
import authRoutes from "./routes/auth";
import roundRoutes from "./routes/rounds";

const app = fastify({ logger: true });

app.register(cookie, {
	secret: process.env.COOKIE_SECRET || "supersecret",
	hook: "onRequest"
});
app.register(cors, {
	origin: "http://localhost:3001", // домен фронта
	credentials: true
});

app.register(prismaPlugin);
app.register(repositoriesPlugin);
app.register(currentUserPlugin);

app.register(authRoutes, { prefix: "/api/auth" });
app.register(roundRoutes, { prefix: "/api/rounds" });

app.get("/", async (_, reply) => {
	reply.send({ message: "Кря!" });
});

const start = async () => {
	try {
		await app.listen({ port: 3000 });
		console.log("Server is running on http://localhost:3000");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
