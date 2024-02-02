import { Context, t } from "elysia";
import { Users } from "../../../models/usersDB/UserModel";
import json, { MessageT, message } from "../../../util/json";
import bcrypt from "bcrypt";
import {
	UserResponseT,
	userResponseNoToken,
	userResponseToken,
} from "../../../util/userUtil";
import { logError } from "../../../util/logging";

interface LoginParams {
	body: {
		username: string;
		password: string;
	};
}
export async function login({
	body,
	set,
}: Context<LoginParams>): Promise<MessageT | UserResponseT> {
	const { username, password } = body;
	try {
		const user = await Users.findOne({
			$or: [{ username }, { email: username }],
		});
		if (!user) {
			set.status = 404;
			return message("User not found");
		}
		const matchUser = await bcrypt.compare(password, user.password);
		if (!matchUser) {
			set.status = 401;
			return message("Incorrect password");
		}
		set.status = 200;
		return userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError("Error logging in user " + username + ": " + e);
		return message("Internal server error");
	}
}
