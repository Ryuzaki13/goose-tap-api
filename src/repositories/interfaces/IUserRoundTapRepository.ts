import { UserWinner } from "types";

export interface IUserRoundTapRepository {
	incrementTap(userId: number, roundId: string): Promise<number>;
	getUserScore(userId: number, roundId: string): Promise<number>;
	getTotalScoreForRound(roundId: string): Promise<number>;
	getWinnerForRound(roundId: string): Promise<UserWinner | null>;
}
