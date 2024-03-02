import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import {
	findUser,
	userResponseNoToken,
} from "../../../../../util/users/userUtil";
import mongoose from "mongoose";
import { Users } from "../../../../../models/usersDB/users/UserModel";
import { revokeRolesMongoQuery } from "../../../../../util/users/roles/revokeRoleMongo";

export async function revokeRoles({
	body,
	params: { user: userId },
	set,
}: Context<{ body: string[]; params: Record<"user", string> }>) {
	try {
		const user = await findUser(userId);
		for (const role of body) {
			if (!mongoose.Types.ObjectId.isValid(role)) {
				set.status = 400;
				return { message: "Invalid role id" };
			}
		}
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		const updated = await Users.findByIdAndUpdate(
			user._id,
			revokeRolesMongoQuery(body),
			{ new: true }
		);
		if (!updated) {
			set.status = 500;
			return { message: "Error revoking roles" };
		}
		set.status = 200;
		return userResponseNoToken(updated);
	} catch (e) {
		set.status = 500;
		logError(`Error revoking role from user ${userId}: ${e}`);
		return { message: "Internal Server Error revoking roles" };
	}
}
