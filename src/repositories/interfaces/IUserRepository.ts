import { User } from "@prisma/client";

export interface IUserRepository {
	find(username: string): Promise<User[] | null>;
	create(username: string, hashedPassword: string, roleId: number): Promise<User>;
	findById(id: number): Promise<(User & { role: { id: number; name: string } }) | null>;
}
