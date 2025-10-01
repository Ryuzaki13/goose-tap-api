import { Round } from "@prisma/client";
import { IRoundRepository } from "repositories/interfaces/IRoundRepository ";
import { IUserRoundTapRepository } from "repositories/interfaces/IUserRoundTapRepository";
import { RoundStatus, RoundWithComputed, UserWithRole } from "types";
import { IRoundService } from "./interfaces/IRoundService";

export class RoundService implements IRoundService {
	constructor(private roundRepository: IRoundRepository, private userRoundRepository: IUserRoundTapRepository) {}

	private computeFields(round: Round): RoundWithComputed {
		const endTime = new Date(round.startTime.getTime() + round.duration * 1000);
		const now = new Date();

		let status: RoundStatus;
		if (now < round.startTime) {
			status = "cooldown";
		} else if (now >= round.startTime && now <= endTime) {
			status = "active";
		} else {
			status = "finished";
		}

		return {
			...round,
			endTime,
			status
		};
	}

	async createRound(duration: number, cooldown: number): Promise<Round> {
		const now = new Date();
		const startTime = new Date(now.getTime() + cooldown * 1000);

		return this.roundRepository.create({
			duration,
			cooldown,
			startTime
		} as Omit<Round, "id">);
	}

	async getAllRounds(): Promise<RoundWithComputed[]> {
		const rounds = await this.roundRepository.findAll();
		return rounds.map((round) => this.computeFields(round));
	}

	async getRound(roundId: string, userId: number) {
		const round = await this.roundRepository.findById(roundId);
		if (!round) throw new Error("Раунд не найден");

		const computed = this.computeFields(round);

		if (computed.status === "active") {
			const score = await this.userRoundRepository.getUserScore(userId, roundId);
			return { ...computed, score } as RoundWithComputed;
		}

		if (computed.status === "finished") {
			const score = await this.userRoundRepository.getUserScore(userId, roundId);
			const total = await this.userRoundRepository.getTotalScoreForRound(roundId);
			const winner = await this.userRoundRepository.getWinnerForRound(roundId);

			return { ...computed, score, total, winner } as RoundWithComputed;
		}

		return computed;
	}

	async tap(user: UserWithRole, roundId: string) {
		const isNikita = user.role === "nikita";

		// Проверка состояния раунда
		const round = await this.roundRepository.findById(roundId);
		if (!round) throw new Error("Раунд не найден");

		const now = new Date();
		const endTime = new Date(round.startTime.getTime() + round.duration * 1000);
		if (now < round.startTime) throw new Error("Раунд ещё не начался");
		if (now > endTime) throw new Error("Раунд уже завершён");

		// Насчёт Никиты не понятно, 0 он должен только на фронте видеть, или в базу тоже не писать?
		// Но тогда общее количество тапов будет некорректным.
		// Пусть будет, что игнорируем его очки полностью.
		if (isNikita) return { score: 0 };

		const score = await this.userRoundRepository.incrementTap(user.id, roundId);

		return { score };
	}
}
