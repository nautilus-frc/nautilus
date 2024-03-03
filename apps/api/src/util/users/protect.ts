import jwt from "jsonwebtoken";
import { User, Users } from "../../models/usersDB/users/UserModel";
import { Context } from "elysia";
import { MessageT, message } from "../general/json";
import { log, logError } from "../general/logging";
import { Permissions } from "../../models/usersDB/users/UserRoleModel";
import { formatUserRoles } from "../users/userUtil";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const ACCOUNT_LEVEL = Object.freeze({
	"UNVERIFIED": 0,
	"NONE": 0, //alias for UNVERIFIED
	"BASE": 1,
	"LEAD": 2,
	"ADMIN": 3,
	"SUPERUSER": 4,
});

//verifies that user has provided valid token in headers and that their account is at the appropriate access level,
// and binds the associated user object to the protected function
//sets content type to application/json
type ProtectAndBindOptions<
	T extends { set: Context["set"] },
	U,
	V = U,
	W = U,
> = Partial<{
	fallback: null | ((user: User, ctx: T) => V | Promise<V>);
	fallbackLevel: ProtectionLevel;
	noTokenFallback: ((ctx: T) => W | Promise<W>) | null;
	requiredPermissions: (keyof Permissions)[] | null;
}>;
export async function protectAndBind<
	T extends { set: Context["set"] },
	U,
	V = U,
	W = U,
>(
	bearer: string | undefined,
	level: ProtectionLevel,
	protecting: (user: User, ctx: T) => U | Promise<U>,
	// fallback?: (user: User, ctx: T) => V | Promise<V>,
	// fallbackLevel: ProtectionLevel = ACCOUNT_LEVEL.NONE,
	// noTokenFallback?: (ctx: T) => W | Promise<W>
	{
		fallback = null,
		fallbackLevel = ACCOUNT_LEVEL.NONE,
		noTokenFallback = null,
		requiredPermissions = null,
	}: ProtectAndBindOptions<T, U, V, W> = {}
): Promise<(ctx: T) => U | V | W | Promise<U | V | W> | MessageT> {
	if (!bearer) {
		if (noTokenFallback) return noTokenFallback;
		return out(message("Unauthorized: No token"), 401);
	}

	try {
		const token = bearer;

		if (!token && noTokenFallback) return noTokenFallback;

		const user = await getUserFromToken(token);

		if (!token || !user) {
			return out(message("Unauthorized: Invalid token"), 403);
		}

		await log(`Request from user ${user.username}`);

		if (requiredPermissions) {
			for (const it of requiredPermissions) {
				if (
					!formatUserRoles(user.roles, user.accountType).permissions[
						it
					]
				) {
					return out(
						message(
							"Forbidden: You do not have permission to access this endpoint"
						),
						403
					);
				}
			}
		}

		const access = user.accountType >= level;
		if (access) {
			return protecting.bind(null, user);
		}
		if (fallback && user.accountType >= fallbackLevel) {
			return fallback.bind(null, user);
		}
		return out(
			message(
				"Forbidden: You do not have permission to access this endpoint"
			),
			403
		);
	} catch (e) {
		logError("Error running user authentication: " + e);
		return out(
			message("Internal server error while authorizing user"),
			500
		);
	}
}

//guards the function to ensure the user is verified but does NOT bind the user object to the function
type ProtectOptions<
	T extends { set: Context["set"] },
	U,
	V = U,
	W = U,
> = Partial<{
	fallback: ((ctx: T) => V | Promise<V>) | null;
	fallbackLevel: ProtectionLevel;
	noTokenFallback: ((ctx: T) => W | Promise<W>) | null;
	requiredPermissions: (keyof Permissions)[] | null;
}>;
export async function protect<
	T extends { set: Context["set"] },
	U,
	V = U,
	W = U,
>(
	bearer: string | undefined,
	level: ProtectionLevel,
	protecting: (ctx: T) => U | Promise<U>,
	{
		fallback = null,
		fallbackLevel = ACCOUNT_LEVEL.NONE,
		noTokenFallback = null,
		requiredPermissions = null,
	}: ProtectOptions<T, U, V, W> = {}
): Promise<(ctx: T) => U | V | W | Promise<U | W | V> | MessageT> {
	// const { fallback, fallbackLevel, noTokenFallback, requiredPermissions } =
	// 	options;
	if (fallback) {
		return protectAndBind(bearer, level, (_, ctx) => protecting(ctx), {
			fallback: (_, ctx) => fallback(ctx),
			fallbackLevel,
			noTokenFallback,
			requiredPermissions,
		});
	} else {
		return protectAndBind(bearer, level, (_, ctx) => protecting(ctx), {
			fallback,
			fallbackLevel,
			noTokenFallback,
			requiredPermissions,
		});
	}
}

//#region helper functions & types

async function getUserFromToken(token: string): Promise<User | null> {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

		return await Users.findById(decoded.id);
	} catch (e) {
		logError(`Error getting user from token: ${e}`);

		return null;
	}
}

type ProtectionLevel = (typeof ACCOUNT_LEVEL)[keyof typeof ACCOUNT_LEVEL];

//returns a dummy function that takes in context as a param but always returns the same given response, and sets the status to the given status as a side effect
function out<T extends { set: Context["set"] }, U>(
	x: U,
	status: number
): (param: T) => U {
	return function (ctx: T) {
		ctx.set.status = status;
		return x;
	};
}

export function generateToken(id: string) {
	return jwt.sign({ id }, JWT_SECRET);
}

//#endregion
