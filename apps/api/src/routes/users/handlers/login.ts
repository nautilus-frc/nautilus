import { Context, t } from "elysia";
import { Users } from "../../../models/usersDB/users/UserModel";
import json, { MessageT, message } from "../../../util/general/json";
import { UserResponseT, userResponseToken } from "../../../util/users/userUtil";
import { logError } from "../../../util/general/logging";

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
		// const matchUser = await bcrypt.compare(password, user.password);
		const matchUser = await Bun.password.verify(password, user.password);
		if (!matchUser) {
			set.status = 401;
			return message("Incorrect password");
		}
		set.status = 200;
		return await userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError("Error logging in user " + username + ": " + e);
		return message("Internal server error");
	}
}
