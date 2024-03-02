import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Users } from "../../../../../models/usersDB/users/UserModel";
import { assignRolesMongoQuery } from "../../../../../util/users/roles/assignRoleMongoQuery";
import { UserRoles } from "../../../../../models/usersDB/users/UserRoleModel";
import mongoose from "mongoose";
import updateUser from "../updateUser";
import {
	findUser,
	userResponseNoToken,
} from "../../../../../util/users/userUtil";

export default async function assignRoles({
	params: { user: userId },
	body,
	set,
}: Context<{ params: Record<"user", string>; body: string[] }>) {
	try {
		for (const role of body) {
			if (!mongoose.Types.ObjectId.isValid(role)) {
				set.status = 400;
				return { message: "Invalid role id" };
			}
		}
		const roles = await UserRoles.find({ _id: { $in: body } });
		const user = await findUser(userId);
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		if (roles.length < body.length) {
			set.status = 404;
			return { message: "One or more roles not found" };
		}
		const updated = await Users.findByIdAndUpdate(
			user._id,
			assignRolesMongoQuery(
				roles.filter((r) => {
					return !user.roles.find((ur) => ur.id == r._id.toString());
				})
			),
			{ new: true }
		);
		if (!updated) {
			set.status = 500;
			return { message: "Error assigning roles" };
		}
		set.status = 200;
		return userResponseNoToken(updated);
	} catch (e) {
		set.status = 500;
		logError(`Error assigning role to user ${userId}: ${e}`);
		return { message: "Internal Server Error assigning roles" };
	}
}
