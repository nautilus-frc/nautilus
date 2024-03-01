import { Context } from "elysia";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import json, { message } from "../../../../util/general/json";
import { logError } from "../../../../util/general/logging";
import {
	userResponseToken,
	validateUserAttendance,
} from "../../../../util/users/userUtil";

export async function getMe(user: User, { set }: Context) {
	try {
		set.status = 200;
		(async function (user: User) {
			if (user) {
				const att = await validateUserAttendance(user.attendance);
				user.attendance = att;
				await user.save();
			}
		})(user);
		return userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError("Error retreiving user from mongo: " + e);
		return message("Error retreiving data from database");
	}
}
