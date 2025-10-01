import { Round } from "@prisma/client";

export interface IRoundRepository {
	create(data: Omit<Round, "id">): Promise<Round>;
	findAll(): Promise<Round[]>;
	findById(id: string): Promise<Round | null>;
	update(id: string, data: Partial<Round>): Promise<Round>;
}
