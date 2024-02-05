import { Context } from "elysia";
import { logError } from "../../../util/general/logging";
import { UserRoles } from "../../../models/usersDB/users/UserRoleModel";
import { formatRoleResponse } from "../../../util/users/roles";

export default async function getRoles({ set }: Context) {
	try {
		const roles = await UserRoles.find({});
		if (!roles) {
			set.status = 404;
			return { message: "No roles found" };
		}
		set.status = 200;
		return roles.map(formatRoleResponse);
	} catch (e) {
		set.status = 500;
		logError("Error getting roles: " + e);
		return { message: "Error getting roles" };
	}
}
