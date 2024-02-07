import { Context } from "elysia";
import { log, logError } from "../../../../util/general/logging";
import {
	findManyUsers,
	findUser,
	updateManyUsers,
	userResponseNoToken,
} from "../../../../util/users/userUtil";
import { User, Users } from "../../../../models/usersDB/users/UserModel";

export default async function revokeRole({
	params: { roleId },
	body,
	set,
}: Context<{
	params: { roleId: string };
	body: string[];
}>) {
	try {
		const users = await findManyUsers(body);
		if (users.length < 1) {
			set.status = 404;
			return { message: "No users found" };
		}
		/**
		 * {
				$pull: {
					roles: {
						id: roleId,
					},
				},
		 */
		const succesful = await updateManyUsers(
			users,
			{
				$pull: {
					roles: {
						id: roleId,
					},
				},
			},
			(it) => !it.roles.find((r) => r.id === roleId)
		);

		if (succesful.length !== users.length) {
			set.status = 500;
			return { message: "Error revoking role from one or more users" };
		}
		set.status = 200;
		return await Promise.all(succesful.map(userResponseNoToken));
	} catch (e) {
		set.status = 500;
		logError("Error revoking role: " + e);
		return { message: "Error revoking role" };
	}
}
