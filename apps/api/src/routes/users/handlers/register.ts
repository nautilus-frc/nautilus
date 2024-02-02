import { Context } from "elysia";
import { Users } from "../../../models/usersDB/UserModel";
import json, { MessageT, message } from "../../../util/json";
import { logError } from "../../../util/logging";
import bcrypt from "bcrypt";
import { UserResponseT, userResponseToken } from "../../../util/userUtil";

interface RegisterParams {
	body: {
		firstname: string;
		lastname: string;
		username: string;
		email: string;
		password: string;
		phone: string;
		subteam?: string;
		grade?: number;
	};
}

export async function register({
	set,
	body,
}: Context<RegisterParams>): Promise<MessageT | UserResponseT> {
	const {
		firstname,
		lastname,
		username,
		email,
		password,
		phone,
		subteam,
		grade,
	} = body;
	try {
		if (await Users.findOne({ email })) {
			set.status = 400;
			return message("Email already in use");
		}
		if (await Users.findOne({ username })) {
			set.status = 400;
			return message("Username already in use");
		}
		if (await Users.findOne({ phone })) {
			set.status = 400;
			return message("Phone number already in use");
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const user = await Users.create({
			firstname,
			lastname,
			username,
			email,
			password: hash,
			phone,
			subteam,
			grade,
			accountType: 0,
		});

		if (!user) {
			set.status = 500;
			return message("Error creating user");
		}

		set.status = 201;
		return userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError(`Error registering user: ${e}`);
		return message("Internal server error");
	}
}
