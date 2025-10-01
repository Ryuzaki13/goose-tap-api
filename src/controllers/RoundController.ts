import { FastifyReply, FastifyRequest } from "fastify";
import { RoundService } from "services/RoundService";

export class RoundController {
	constructor(private roundService: RoundService, private defaultRoundDuration: number, private defaultCooldownDuration: number) {}

	createRound = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { duration, cooldown } = request.body as { duration: number; cooldown: number };
			const round = await this.roundService.createRound(
				duration ?? this.defaultRoundDuration,
				cooldown ?? this.defaultCooldownDuration
			);
			reply.status(201).send(round);
		} catch {
			reply.status(500).send({ error: "Не удалось создать раунд" });
		}
	};

	getAllRounds = async (_: FastifyRequest, reply: FastifyReply) => {
		try {
			const rounds = await this.roundService.getAllRounds();
			reply.send(rounds);
		} catch {
			reply.status(500).send({ error: "Не удалось получить список раундов" });
		}
	};

	getRound = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			if (!request.user) return reply.status(401).send();

			const { roundId } = request.params as { roundId: string };

			console.log("roundId", roundId);

			const round = await this.roundService.getRound(roundId, request.user.id);
			if (!round) return reply.status(404).send({ error: "Раунд не найден" });
			reply.send(round);
		} catch {
			reply.status(500).send({ error: "Не удалось получить раунд" });
		}
	};

	tap = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			if (!request.user) return reply.status(401).send();

			const { roundId } = request.body as { roundId: string };

			// TODO: можно добавить проверку user-agent, fingerprint или ещё что-то, добавить rate limit.
			// Вообще это надо через вебсокеты делать... Иначе не поборать мультивкладки.

			const result = await this.roundService.tap(request.user, roundId);
			return reply.send({ score: result.score });
		} catch (e: any) {
			return reply.status(400).send({ error: e.message });
		}
	};
}
