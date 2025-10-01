import bcrypt from "bcryptjs";
import { IRoleRepository } from "../repositories/interfaces/IRoleRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { getRoleByUsername } from "../utils/getRoleByUsername";
import { IAuthService } from "./interfaces/IAuthService";

export class AuthService implements IAuthService {
	constructor(private users: IUserRepository, private roles: IRoleRepository) {}

	async login(username: string, password: string) {
		const roleName = getRoleByUsername(username);
		const users = await this.users.find(username);

		if (!users) {
			let role = await this.roles.findByName(roleName);
			if (!role) {
				role = await this.roles.create(roleName);
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await this.users.create(username, hashedPassword, role.id);
			return { username: user.username, role: roleName };
		}

		for (const user of users) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				return { id: user.id, username: user.username, role: roleName };
			}
		}

		throw new Error("Неверное имя пользователя или пароль");
	}

	async getUserById(id: number) {
		const user = await this.users.findById(id);
		if (!user) return null;
		return {
			username: user.username,
			role: user.role.name
		};
	}
}
