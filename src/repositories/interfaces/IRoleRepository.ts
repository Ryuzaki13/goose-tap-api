import { Role } from "@prisma/client";

export interface IRoleRepository {
	findByName(name: string): Promise<Role | null>;
	create(name: string): Promise<Role>;
}
