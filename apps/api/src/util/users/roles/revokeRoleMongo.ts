import { Role } from "../../../models/usersDB/users/UserRoleModel";

export function revokeRoleMongoQuery(roleId: string): {
	$pull: { roles: { id: string } };
} {
	return {
		$pull: {
			roles: {
				id: roleId,
			},
		},
	};
}

export function revokeRolesMongoQuery(roleIds: string[]) {
	return {
		$pull: {
			roles: {
				id: { $in: roleIds },
			},
		},
	};
}
