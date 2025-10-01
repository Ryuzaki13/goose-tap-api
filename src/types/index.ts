import { Round } from "@prisma/client";

export type UserRole = "admin" | "nikita" | "other";

export type RoundStatus = "cooldown" | "active" | "finished";

export interface UserWinner {
	username: string;
	score: number;
}

export interface RoundWithComputed extends Round {
	endTime: Date;
	status: RoundStatus;
	score?: number;
	total?: number;
	winner?: UserWinner;
}

export interface UserWithRole {
	id: number;
	role: UserRole;
}

// export interface Role {
// 	id: number;
// 	name: UserRole;
// }

// export interface Round {
// 	id: number;
// 	startTime: Date;
// 	endTime: Date | null;
// 	duration: number; // in seconds
// 	cooldown: number; // in seconds
// }

// export interface UserRoundTap {
// 	id: number;
// 	userId: number;
// 	roundId: number;
// 	taps: number;
// }
