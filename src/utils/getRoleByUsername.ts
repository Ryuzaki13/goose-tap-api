import { UserRole } from "types";

export function getRoleByUsername(username: string): UserRole {
	if (username.toLowerCase() === "admin") return "admin";
	if (username.toLowerCase() === "никита" || username.toLowerCase() === "nikita") return "nikita";
	return "other";
}
