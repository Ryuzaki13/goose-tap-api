import { UserRole } from "../../types/index";

export interface IAuthService {
	login(
		username: string,
		password: string
	): Promise<
		| {
				username: string;
				role: UserRole;
				id?: undefined;
		  }
		| {
				id: number;
				username: string;
				role: UserRole;
		  }
	>;
	getUserById(id: number): Promise<{
		username: string;
		role: string;
	} | null>;
}
