import { Context } from "elysia";
import { Users } from "../../../models/usersDB/users/UserModel";
import json, { message } from "../../../util/general/json";
import {
	limitedUserResponse,
	userResponseNoToken,
} from "../../../util/users/userUtil";
import { logError } from "../../../util/general/logging";

export async function getUsersAdmin({ set, query }: Context) {
	try {
		const users = await Users.find({ ...query });
		if (!users || users.length < 1) {
			set.status = 404;
			return message("No users found");
		}
		set.status = 200;
		return await Promise.all(users.map(userResponseNoToken));
	} catch (e) {
		set.status = 500;
		logError(`Error accessing user list from database: ${e}`);
		return message("Error getting users from dataabase");
	}
}

export async function getUsersRaw({ set, query }: Context) {
	try {
		const users = await Users.find({ ...query });
		if (!users || users.length < 1) {
			set.status = 404;
			return message("No users found");
		}
		set.status = 200;
		return users;
		// return users.map((it) => it.toObject());
	} catch (e) {
		set.status = 500;
		logError(`Error accessing user list from database: ${e}`);
		return message("Error getting users from database");
	}
}

export async function getUsersDefault({ set, query }: Context) {
	try {
		const users = await Users.find({ ...query });
		if (!users || users.length < 1) {
			set.status = 404;
			return message("No users found");
		}
		set.status = 200;
		return await Promise.all(users.map(limitedUserResponse));
	} catch (e) {
		set.status = 500;
		logError(`Error accessing user list from database: ${e}`);
		return message("Error getting users from database");
	}
}
