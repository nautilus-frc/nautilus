import { Context } from "elysia";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import json, { MessageT } from "../../../../util/general/json";
import { logSuccess, logError } from "../../../../util/general/logging";

export const deleteMe = async (
	user: User,
	{ set }: Context
): Promise<MessageT> => {
	try {
		const u = await Users.findByIdAndDelete(user._id);
		if (!u) {
			set.status = 404;
			return { message: "Account not found" };
		}
		logSuccess("Account deleted: " + user.username);
		set.status = 200;
		return { message: "Account deleted" };
	} catch {
		set.status = 500;
		logError("Error deleting account for user: " + user.username);
		return { message: "Error deleting account" };
	}
};
