import { Context } from "elysia";
import { logError } from "../../../../util/logging";
import {
	findManyUsers,
	findUser,
	updateManyUsers,
	userResponseNoToken,
} from "../../../../util/userUtil";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import { UserRoles } from "../../../../models/usersDB/users/UserRoleModel";
import { it } from "bun:test";

export default async function assignRole({
	params: { roleId },
	body,
	set,
}: Context<{
	params: { roleId: string };
	body: string[];
}>) {
	try {
		const role = await UserRoles.findById(roleId);
		if (!role) {
			set.status = 404;
			return { message: "Role not found" };
		}

		const users: User[] = await findManyUsers(body);
		// const users: User[] = [];
		if (users.length < 1) {
			set.status = 404;
			return { message: "No users found" };
		}
		// const successful: User[] = [];

		// for (const user of users) {
		// 	if (user.roles.find((r) => r.id === role._id.toString())) {
		// 		successful.push(user);
		// 		continue;
		// 	}
		// 	const updated = await Users.findByIdAndUpdate(
		// 		user._id,
		// 		{
		// 			$push: {
		// 				roles: {
		// 					name: role.name,
		// 					permissions: role.permissions,
		// 					id: role._id.toString(),
		// 				},
		// 			},
		// 		},
		// 		{ new: true }
		// 	);
		// 	if (updated) successful.push(updated);
		// 	else logError("Error assigning role to user: " + user._id);
		// }

		const successful = await updateManyUsers(
			users,
			{
				$push: {
					roles: {
						name: role.name,
						permissions: role.permissions,
						id: role._id.toString(),
					},
				},
			},
			(it) => Boolean(it.roles.find((r) => r.id === role._id.toString()))
		);

		if (successful.length !== users.length) {
			set.status = 500;
			return { message: "Error assigning role to one or more users" };
		}
		set.status = 201;
		return await Promise.all(successful.map(userResponseNoToken));
	} catch (e) {
		set.status = 500;
		logError("Error adding role: " + e);
		return { message: "Error adding role" };
	}
}
