import { User } from "../models/usersDB/UserModel";
import { Permissions } from "../models/usersDB/UserRoleModel";
import json from "./json";
import { ACCOUNT_LEVEL, generateToken } from "./protect";

type ReturnedUserRoles = {
	roles: string[];
	permissions: Permissions;
};

export function formatUserRoles(
	r: User["roles"],
	accountType: User["accountType"] = 0
): ReturnedUserRoles {
	const perms: Permissions =
		accountType >= ACCOUNT_LEVEL.ADMIN
			? {
					generalScouting: true,
					pitScouting: true,
					viewScoutingData: true,
					blogPosts: true,
					makeMeetings: true,
					viewMeetings: true,
					deleteMeetings: true,
					makeAnnouncements: true,
				}
			: {
					generalScouting: false,
					pitScouting: false,
					viewScoutingData: false,
					blogPosts: false,
					makeMeetings: false,
					viewMeetings: false,
					deleteMeetings: false,
					makeAnnouncements: false,
				};

	const roles: string[] = [];

	for (const role of r) {
		roles.push(role.name);
		for (const key of Object.keys(perms)) {
			const val = role.permissions[key as keyof Permissions];
			if (val) {
				perms[key as keyof Permissions] = true;
			}
		}
	}
	return { roles, permissions: perms };
}

export function userResponseNoToken(user: User) {
	const ret = {
		...user.toObject(),
		_id: user._id.toString(),
		password: undefined,
		"__v": undefined,
		createdAt: undefined,
		updatedAt: undefined,
		...formatUserRoles(user.roles, user.accountType),
	};

	// delete ret.password;
	// delete ret.__v;
	// delete ret.createdAt;
	// delete ret.updatedAt;

	const {
		password,
		__v,
		createdAt,
		updatedAt,
		forgotPassword,
		rateLimit,
		...out
	} = ret;

	return out;
}

export function limitedUserResponse(user: User) {
	return {
		_id: user._id.toString(),
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		subteam: user.subteam,
		roles: formatUserRoles(user.roles, user.accountType).roles,
		accountType: user.accountType,
	};
}

export type LimitedUserResponse = ReturnType<typeof limitedUserResponse>;

//use with /me routes and login + register
export function userResponseToken(user: User) {
	return {
		...userResponseNoToken(user),
		token: generateToken(user._id.toString()),
	};
}

export type UserResponseNoToken = ReturnType<typeof userResponseNoToken>;

export type UserResponseT = UserResponseNoToken & { token: string };
