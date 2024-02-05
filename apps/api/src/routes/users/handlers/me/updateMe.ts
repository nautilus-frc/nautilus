import { Context } from "elysia";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import json, { message } from "../../../../util/json";
import { logError, logSuccess } from "../../../../util/logging";
import { userResponseToken } from "../../../../util/userUtil";

type Args = Context<{
	body: {
		firstname?: string;
		lastname?: string;
		email?: string;
		phone?: string;
		subteam?: string;
		grade?: number;
	};
}>;

export default async function updateMe(user: User, { body, set }: Args) {
	try {
		const u = await Users.findByIdAndUpdate(
			user._id,
			{ ...body },
			{ new: true }
		);
		if (!u) {
			return message("Account not found");
		}
		logSuccess(
			"Account updated: " +
				user.username +
				": " +
				JSON.stringify(body, null, 2)
		);
		set.status = 201;
		return await userResponseToken(u);
	} catch (e) {
		logError(
			"Error updating account for user: " + user.username + "\n" + e
		);
		set.status = 500;
		return message("Error updating account");
	}
}
