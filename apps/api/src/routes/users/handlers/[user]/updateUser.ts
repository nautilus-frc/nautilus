import { Context } from "elysia";
import { IUser, Users } from "../../../../models/usersDB/users/UserModel";
import { message } from "../../../../util/json";
import { logError } from "../../../../util/logging";
import {
	userResponseNoToken,
	userResponseToken,
} from "../../../../util/userUtil";
import mongoose from "mongoose";

export type TUserUpdate = Partial<
	Omit<IUser, "password" | "forgotPassword" | "rateLimit" | "attendance">
>;

export default async function updateUser({
	body,
	set,
	params: { user: userId },
}: Context<{ body: TUserUpdate; params: Record<"user", string> }>) {
	try {
		const user = mongoose.Types.ObjectId.isValid(userId)
			? await Users.findById(userId)
			: await Users.findOne({
					$or: [{ username: userId }, { email: userId }],
				});

		if (!user) {
			set.status = 404;
			return message("User not found");
		}

		const updatedUser = await Users.findByIdAndUpdate(user._id, body, {
			new: true,
		});
		if (!updatedUser) {
			set.status = 404;
			return message("User not found");
		}
		set.status = 201;
		return await userResponseNoToken(updatedUser);
	} catch (e) {
		logError("Error updating account for user: " + userId + "\n" + e);
		set.status = 500;
		return message("Error updating account");
	}
}
