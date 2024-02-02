import { Context } from "elysia";
import { Users } from "../../../../models/usersDB/UserModel";
import {
	limitedUserResponse,
	userResponseNoToken,
} from "../../../../util/userUtil";

export async function getUserDefault({
	params: { userId },
	set,
}: Context<{ params: Record<"userId", string> }>) {
	try {
		const user = await Users.findById(userId);
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		set.status = 200;
		return limitedUserResponse(user);
	} catch (e) {
		set.status = 500;
		return { message: "Error retreiving user data from database" };
	}
}

export async function getUserAdmin({
	params: { userId },
	set,
}: Context<{ params: Record<"userId", string> }>) {
	try {
		const user = await Users.findById(userId);
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		set.status = 200;
		return userResponseNoToken(user);
	} catch (e) {
		set.status = 500;
		return { message: "Error retreiving user data from database" };
	}
}
