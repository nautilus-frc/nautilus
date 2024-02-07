import { Context } from "elysia";
import {
	Permissions,
	UserRoles,
} from "../../../models/usersDB/users/UserRoleModel";
import { Users } from "../../../models/usersDB/users/UserModel";
import mongoose from "mongoose";
import { findUser } from "../../../util/users/userUtil";
import { logError } from "../../../util/general/logging";
import { formatRoleResponse } from "../../../util/users/roles";

export default async function createRole({
	set,
	body: { name, permissions },
}: Context<{
	body: {
		name: string;
		permissions: Partial<Permissions>;
	};
}>) {
	try {
		const perms: Permissions = {
			blogPosts: false,
			viewMeetings: false,
			deleteMeetings: false,
			generalScouting: false,
			pitScouting: false,
			viewScoutingData: false,
			makeMeetings: false,
			makeAnnouncements: false,
		};

		for (const [k, v] of Object.entries(permissions)) {
			perms[k as keyof Permissions] = v === true;
		}

		const role = await UserRoles.create({
			name,
			permissions: perms,
		});
		if (!role) {
			set.status = 500;
			return { message: "Error creating role" };
		}
		set.status = 201;
		return formatRoleResponse(role);
	} catch (e) {
		set.status = 500;
		logError("Error adding role: " + e);
		return { message: "Error creating role" };
	}
}
