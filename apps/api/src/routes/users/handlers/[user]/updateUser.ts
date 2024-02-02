import { Context } from "elysia";
import { IUser, User, Users } from "../../../../models/usersDB/UserModel";
import json, { message } from "../../../../util/json";
import { logError } from "../../../../util/logging";
import { userResponseToken } from "../../../../util/userUtil";

export type TUserUpdate = Partial<
	Omit<IUser, "password" | "forgotPassword" | "rateLimit" | "attendance">
>;

export default async function updateUser({
	body,
	set,
	params: { userId },
}: Context<{ body: TUserUpdate; params: Record<"userId", string> }>) {
	try {
		const updatedUser = await Users.findByIdAndUpdate(userId, body, {
			new: true,
		});
		if (!updatedUser) {
			set.status = 404;
			return message("User not found");
		}
		set.status = 201;
		return userResponseToken(updatedUser);
	} catch (e) {
		logError("Error updating account for user: " + userId + "\n" + e);
		set.status = 500;
		return message("Error updating account");
	}
}
