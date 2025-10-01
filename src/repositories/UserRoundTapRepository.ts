import { PrismaClient } from "@prisma/client";
import { IUserRoundTapRepository } from "./interfaces/IUserRoundTapRepository";

export class UserRoundTapRepository implements IUserRoundTapRepository {
	constructor(private prisma: PrismaClient) {}

	async incrementTap(userId: number, roundId: string) {
		return this.prisma.$transaction(async (tx) => {
			const current = await tx.userRoundTap.findUnique({
				where: { userId_roundId: { userId, roundId } },
				select: { taps: true, score: true }
			});

			let newScore: number = 1;

			if (!current) {
				await tx.userRoundTap.create({
					data: { userId, roundId, taps: newScore, score: newScore }
				});
			} else {
				const nextTap = current.taps + 1;
				const points = nextTap % 11 === 0 ? 10 : 1;
				newScore = current.score + points;

				await tx.userRoundTap.update({
					where: { userId_roundId: { userId, roundId } },
					data: { taps: nextTap, score: newScore }
				});
			}

			return newScore;
		});
	}

	async getUserScore(userId: number, roundId: string) {
		const record = await this.prisma.userRoundTap.findUnique({
			where: { userId_roundId: { userId, roundId } },
			select: { score: true }
		});
		return record?.score ?? 0;
	}

	async getTotalScoreForRound(roundId: string) {
		const res = await this.prisma.userRoundTap.aggregate({
			where: { roundId },
			_sum: { score: true }
		});
		return res._sum.score ?? 0;
	}

	async getWinnerForRound(roundId: string) {
		const winner = await this.prisma.userRoundTap.findFirst({
			where: { roundId },
			orderBy: { score: "desc" },
			include: { user: { select: { id: true, username: true } } }
		});

		if (!winner) return null;

		return {
			username: winner.user.username,
			score: winner.score
		};
	}
}
