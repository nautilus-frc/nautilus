import jwt from "jsonwebtoken";
import { User } from "../models/usersDB/UserModel";
import { Context } from "elysia";
import { message } from "./json";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const PROTECTION_LEVEL = Object.freeze({
	"UNVERIFIED": 0,
	"NONE": 0, //alias for UNVERIFIED
	"BASE": 1,
	"LEAD": 2,
	"ADMIN": 3,
	"SUPERUSER": 4,
});

export function generateToken(id: string) {
	return jwt.sign({ id }, JWT_SECRET);
}

type ProtectionLevel = (typeof PROTECTION_LEVEL)[keyof typeof PROTECTION_LEVEL];

export interface ProtectedContext extends Context {
	user: User;
}

export async function protect(
	level: ProtectionLevel,
	ctx: Context,
	protecting: (ctx: ProtectedContext) => string | Promise<string>,
	fallback?: (ctx: ProtectedContext) => string | Promise<string>
): Promise<string> {
	const { headers } = ctx;

	ctx.set.headers["Content-Type"] = "application/json";

	//#region Old Code
	// let token: string | undefined;
	// let usr: User | undefined | null;
	// if (headers.authorization && headers.authorization.startsWith("Bearer")) {
	// 	try {
	// 		// Set token from Bearer token in header
	// 		token = headers.authorization.split(" ")[1];

	// 		// Verify token
	// 		const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

	// 		// Get user from token
	// 		usr = await User.findById(decoded.id);
	// 	} catch (err) {
	// 		console.log(err);
	// 		ctx.set.status = 401;
	// 		return () => message("Unauthorized");
	// 	}
	// }

	// const user = usr;

	//#endregion

	if (
		!(headers.authorization && headers.authorization.startsWith("Bearer"))
	) {
		ctx.set.status = 401;
		return message("Unauthorized: No token");
	}

	try {
		const token = headers.authorization.split(" ")[1];

		const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

		const user = await User.findById(decoded.id);

		if (!token || !user) {
			ctx.set.status = 401;
			return message("Unauthorized: No token");
		}

		const accountType = user.accountType >= level;
		if (accountType) {
			return await protecting({ ...ctx, user });
		}
		if (fallback) {
			return await fallback({ ...ctx, user });
		}
		ctx.set.status = 401;
		return message("Unauthorized");
	} catch {
		ctx.set.status = 401;
		return message("Unauthorized: Invalid token");
	}
}
