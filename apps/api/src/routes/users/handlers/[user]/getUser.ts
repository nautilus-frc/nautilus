import { Context } from "elysia";
import { Users } from "../../../../models/usersDB/users/UserModel";
import {
	limitedUserResponse,
	userResponseNoToken,
} from "../../../../util/userUtil";
import { logError } from "../../../../util/logging";
import mongoose from "mongoose";

export async function getUserDefault({
	params: { user: userId },
	set,
}: Context<{ params: Record<"user", string> }>) {
	try {
		const user = mongoose.Types.ObjectId.isValid(userId)
			? await Users.findById(userId)
			: await Users.findOne({
					$or: [{ username: userId }, { email: userId }],
				});
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		set.status = 200;
		return limitedUserResponse(user);
	} catch (e) {
		set.status = 500;
		logError("Error retreiving user from mongo: " + e);
		return { message: "Error retreiving user data from database" };
	}
}

export async function getUserAdmin({
	params: { user: userId },
	set,
}: Context<{ params: Record<"user", string> }>) {
	try {
		const user = mongoose.Types.ObjectId.isValid(userId)
			? await Users.findById(userId)
			: await Users.findOne({
					$or: [{ username: userId }, { email: userId }],
				});
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		set.status = 200;
		return await userResponseNoToken(user);
	} catch (e) {
		set.status = 500;
		logError("Error retreiving user from mongo: " + e);
		return { message: "Error retreiving user data from database" };
	}
}
