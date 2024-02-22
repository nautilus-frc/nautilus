import { Context } from "elysia";
import { Users } from "../../../models/usersDB/users/UserModel";
import json, { MessageT, message } from "../../../util/general/json";
import { logError } from "../../../util/general/logging";
import { UserResponseT, userResponseToken } from "../../../util/users/userUtil";
import { gradeToGradYear } from "../../../util/users/grade";

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

		// const salt = await bcrypt.genSalt(10);
		// const hash = await bcrypt.hash(password, salt);
		const hash = await Bun.password.hash(password, {
			algorithm: "bcrypt",
			cost: 10,
		});

		const user = await Users.create({
			firstname,
			lastname,
			username,
			email,
			password: hash,
			phone,
			subteam,
			grade: grade ? gradeToGradYear(grade) : grade,
			accountType: 0,
		});

		if (!user) {
			set.status = 500;
			return message("Error creating user");
		}

		set.status = 201;
		return await userResponseToken(user);
	} catch (e) {
		set.status = 500;
		logError(`Error registering user: ${e}`);
		return message("Internal server error");
	}
}
