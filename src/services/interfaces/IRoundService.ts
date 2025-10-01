import { Round } from "@prisma/client";
import { RoundWithComputed, UserWithRole } from "types";

export interface IRoundService {
	createRound(duration: number, cooldown: number): Promise<Round>;
	getAllRounds(): Promise<RoundWithComputed[]>;
	getRound(roundId: string, userId: number): Promise<RoundWithComputed | null>;
	tap(user: UserWithRole, roundId: string, username: string): Promise<{ score: number }>;
}
