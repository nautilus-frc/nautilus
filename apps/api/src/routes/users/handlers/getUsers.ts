import { Context } from "elysia";
import { Users } from "../../../models/usersDB/UserModel";
import json, { message } from "../../../util/json";
import {
	limitedUserResponse,
	userResponseNoToken,
} from "../../../util/userUtil";
import { logError } from "../../../util/logging";

export async function getUsersAdmin({ set, query }: Context) {
	try {
		const users = await Users.find({ ...query });
		if (!users) {
			set.status = 404;
			return message("No users found");
		}
		set.status = 200;
		return users.map((it) => userResponseNoToken(it));
		// return json(users);
	} catch (e) {
		set.status = 500;
		logError(`Error accessing user list from database: ${e}`);
		return message("Error getting users from dataabase");
	}
}

export async function getUsersDefault({ set, query }: Context) {
	try {
		const users = await Users.find({ ...query });
		if (!users) {
			set.status = 404;
			return message("No users found");
		}
		set.status = 200;
		return users.map((it) => limitedUserResponse(it));
		// return json(users);
	} catch (e) {
		set.status = 500;
		logError(`Error accessing user list from database: ${e}`);
		return message("Error getting users from database");
	}
}
