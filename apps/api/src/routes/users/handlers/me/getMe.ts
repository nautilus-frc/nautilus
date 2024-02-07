import { Context } from "elysia";
import { User } from "../../../../models/usersDB/users/UserModel";
import json, { message } from "../../../../util/general/json";
import { logError } from "../../../../util/general/logging";
import { userResponseToken } from "../../../../util/users/userUtil";

export async function getMe(user: User, { set }: Context) {
	try {
		set.status = 200;
		return await userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError("Error retreiving user from mongo: " + e);
		return message("Error retreiving data from database");
	}
}
