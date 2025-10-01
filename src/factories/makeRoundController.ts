import { PrismaClient } from "@prisma/client";
import { RoundController } from "controllers/RoundController";
import { RoundRepository } from "repositories/RoundRepository";
import { UserRoundTapRepository } from "repositories/UserRoundTapRepository";
import { RoundService } from "services/RoundService";

export function makeRoundController(prisma: PrismaClient) {
	const roundRepository = new RoundRepository(prisma);
	const userRoundTapRepository = new UserRoundTapRepository(prisma);
	const service = new RoundService(roundRepository, userRoundTapRepository);

	const defaultRoundDuration = parseInt(process.env.ROUND_DURATION || "60", 10);
	const defaultCooldownDuration = parseInt(process.env.COOLDOWN_DURATION || "30", 10);

	return new RoundController(service, defaultRoundDuration, defaultCooldownDuration);
}
