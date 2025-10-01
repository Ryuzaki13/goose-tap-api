import { IRoleRepository } from "repositories/interfaces/IRoleRepository";
import { IUserRepository } from "repositories/interfaces/IUserRepository";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";

export function makeAuthController(userRepo: IUserRepository, roleRepo: IRoleRepository) {
	const service = new AuthService(userRepo, roleRepo);

	return new AuthController(service);
}
