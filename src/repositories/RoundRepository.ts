import { PrismaClient, Round } from "@prisma/client";
import { IRoundRepository } from "./interfaces/IRoundRepository ";

export class RoundRepository implements IRoundRepository {
	constructor(private prisma: PrismaClient) {}

	async create(data: Omit<Round, "id">): Promise<Round> {
		return this.prisma.round.create({ data });
	}

	async findAll(): Promise<Round[]> {
		return this.prisma.round.findMany();
	}

	async findById(id: string): Promise<Round | null> {
		return this.prisma.round.findUnique({ where: { id } });
	}

	async update(id: string, data: Partial<Round>): Promise<Round> {
		return this.prisma.round.update({ where: { id }, data });
	}

	async incrementTap(userId: number, roundId: string) {
		return this.prisma.$transaction(async (tx) => {
			const current = await tx.userRoundTap.findUnique({
				where: { userId_roundId: { userId, roundId } },
				select: { taps: true }
			});

			let points: number = 1;
			let newScore: number = 1;

			if (!current) {
				await tx.userRoundTap.create({
					data: { userId, roundId, taps: newScore }
				});
			} else {
				const nextTap = current.taps + 1;
				points = nextTap % 11 === 0 ? 10 : 1;
				newScore = current.taps + points;

				await tx.userRoundTap.update({
					where: { userId_roundId: { userId, roundId } },
					data: { taps: newScore }
				});
			}

			return { score: newScore };
		});
	}

	async getTotalTapsForRound(roundId: string) {
		return this.prisma.userRoundTap.aggregate({
			where: { roundId },
			_sum: { taps: true }
		});
	}
}
