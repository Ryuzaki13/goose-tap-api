import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "services/AuthService";
import { UserWithRole } from "types";

export class AuthController {
	constructor(private service: AuthService) {}

	login = async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, password } = request.body as {
			username: string;
			password: string;
		};

		try {
			const user = await this.service.login(username, password);

			// Для тестового приложения достаточно напрямую id пользователя записать.
			// Но лучше использовать, например, JWT.
			reply.setCookie("user", JSON.stringify({ id: user.id, role: user.role }), {
				httpOnly: true,
				sameSite: "lax", // "strict" сейчас не нужен...
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: 60 * 60 * 24 * 7
			});

			reply.send(user);
		} catch (err: any) {
			console.error(err);
			reply.status(401).send({ error: err.message ?? "Ошибка при входе в систему" });
		}
	};

	me = async (request: FastifyRequest, reply: FastifyReply) => {
		const sessionUser = request.cookies.user;

		if (sessionUser && sessionUser !== "undefined") {
			try {
				const userAndRole = JSON.parse(sessionUser) as UserWithRole;
				const user = await this.service.getUserById(Number(userAndRole.id));
				if (!user) {
					return reply.status(401).send({ error: "Пользователь не найден" });
				}

				reply.send(user);
			} catch {
				// noop
			}
		}

		return reply.status(401).send({ error: "Не авторизован" });
	};
}
