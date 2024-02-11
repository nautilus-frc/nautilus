import mongoose, { UpdateQuery } from "mongoose";
import { IUser, User, Users } from "../../models/usersDB/users/UserModel";
import { Permissions } from "../../models/usersDB/users/UserRoleModel";
import json from "../general/json";
import { ACCOUNT_LEVEL, generateToken } from "./protect";
import { Meetings } from "../../models/usersDB/meetings/MeetingModel";
import { logError } from "../general/logging";
import { usersDB } from "../../config/db";

type ReturnedUserRoles = {
	roles: string[];
	permissions: Permissions;
};

export function formatUserRoles(
	uRoles: User["roles"],
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

	for (const role of uRoles) {
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

export async function validateUserAttendance(attendance: User["attendance"]) {
	const out: User["attendance"] = {};
	for (const [k, v] of Object.entries(attendance)) {
		let hours = 0;
		const logs: User["attendance"][string]["logs"] = [];
		for (const { meetingId, verifiedBy } of v.logs) {
			const meeting = await Meetings.findById(meetingId);
			if (meeting) {
				hours += meeting.value;
				logs.push({ meetingId, verifiedBy });
			}
		}
		out[k] = { totalHoursLogged: hours, logs };
	}
	return out;
}

export async function userResponseNoToken(user: User) {
	validateUserAttendance(user.attendance).then((att) => {
		Users.findByIdAndUpdate(user._id, { attendance: att });
	});

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

export async function findUser(u: string) {
	return mongoose.Types.ObjectId.isValid(u)
		? await Users.findById(u)
		: await Users.findOne({ $or: [{ username: u }, { email: u }] });
}

export async function findManyUsers(u: string[]) {
	try {
		const out: User[] = [];
		for (const user of u) {
			const found = await findUser(user);
			if (found) out.push(found);
		}
		return out;
	} catch (e) {
		logError("Error finding users: " + e);
		return [];
	}
}

export async function updateManyUsers(
	users: User[],
	update: UpdateQuery<IUser>,
	ignore: (user: User) => boolean = () => false,
	abortOnFail = true
) {
	const successful: User[] = [];

	try {
		for (const user of users) {
			if (ignore(user)) {
				successful.push(user);
				continue;
			}
			const updated = await Users.findByIdAndUpdate(user._id, update, {
				new: true,
			});
			if (updated) successful.push(updated);
			else logError("Error updating user: " + user._id);
		}
		if (abortOnFail && successful.length !== users.length) {
			throw new Error(
				"Error updating 1 or more users with abortOnFail true; aborting transaction and rolling back changes"
			);
		}
		return successful;
	} catch (e) {
		logError("Error updating users: " + e);
		if (abortOnFail) {
			for (const user of users) {
				await Users.replaceOne({ _id: user._id }, user);
			}
			return [];
		}
		return successful;
	}
}

export type LimitedUserResponse = ReturnType<typeof limitedUserResponse>;

//use with /me routes and login + register
export async function userResponseToken(user: User) {
	return {
		...(await userResponseNoToken(user)),
		token: generateToken(user._id.toString()),
	};
}

export type UserResponseNoToken = Awaited<
	ReturnType<typeof userResponseNoToken>
>;

export type UserResponseT = UserResponseNoToken & { token: string };
