import { Context } from "elysia";
import {
	Permissions,
	UserRoles,
} from "../../../../models/usersDB/users/UserRoleModel";
import { Users } from "../../../../models/usersDB/users/UserModel";
import { logError } from "../../../../util/logging";
import { formatRoleResponse } from "../../../../util/roles";

export default async function updateRole({
	params: { roleId },
	body: { name, permissions },
	set,
}: Context<{
	params: {
		roleId: string;
	};
	body: {
		name?: string;
		permissions?: Partial<Permissions>;
	};
}>) {
	try {
		const old = await UserRoles.findById(roleId);
		if (!old) {
			set.status = 404;
			return { message: "Role not found" };
		}
		const perms = { ...old.toObject().permissions };
		if (permissions)
			for (const [k, v] of Object.entries(permissions)) {
				if (v === true) perms[k as keyof Permissions] = true;
				if (v === false) perms[k as keyof Permissions] = false;
			}
		console.log(JSON.stringify(perms));
		const updated = await UserRoles.findByIdAndUpdate(
			old._id,
			{
				name: name ? name : old.name,
				permissions: { ...perms },
			},
			{ new: true }
		);
		if (!updated) {
			set.status = 500;
			return { message: "Error updating role" };
		}
		const users = await Users.find({
			roles: {
				$elemMatch: {
					id: updated._id.toString(),
				},
			},
		});
		if (users) {
			for (const user of users) {
				await Users.updateOne(
					{
						_id: user._id,
						"roles.id": updated._id.toString(),
					},
					{
						$set: {
							"roles.$.name": updated.name,
							"roles.$.permissions": updated.permissions,
						},
					}
				);
			}
		}
		set.status = 201;
		return formatRoleResponse(updated);
	} catch (e) {
		set.status = 500;
		logError("Error updating role: " + e);
		return { message: "Error updating role" };
	}
}
