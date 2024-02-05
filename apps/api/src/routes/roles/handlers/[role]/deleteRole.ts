import { Context } from "elysia";
import { UserRoles } from "../../../../models/usersDB/users/UserRoleModel";
import { logError } from "../../../../util/general/logging";
import { Users } from "../../../../models/usersDB/users/UserModel";
import mongoose from "mongoose";

export default async function deleteRole({
	set,
	params: { roleId },
}: Context<{
	params: {
		roleId: string;
	};
}>) {
	try {
		const deleted = await UserRoles.findByIdAndDelete(roleId);
		if (!deleted) {
			set.status = 404;
			return { message: "Role not found" };
		}
		const users = await Users.find({
			roles: {
				$elemMatch: {
					id: deleted._id.toString(),
				},
			},
		});
		if (users) {
			for (const user of users) {
				await Users.findByIdAndUpdate(user._id, {
					$pull: {
						roles: {
							id: deleted._id.toString(),
						},
					},
				});
			}
		}
		set.status = 200;
		return { message: "Role deleted" };
	} catch (e) {
		set.status = 500;
		logError("Error deleting role: " + e);
		return { message: "Error deleting role" };
	}
}
