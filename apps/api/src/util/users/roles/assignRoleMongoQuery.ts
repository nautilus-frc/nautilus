import { Permissions, Role } from "../../../models/usersDB/users/UserRoleModel";

export function assignRoleMongoQuery(role: Role): {
	$push: { roles: { name: string; permissions: Permissions; id: string } };
} {
	return {
		$push: {
			roles: roleToUserRole(role),
		},
	};
}

function roleToUserRole(role: Role) {
	return {
		name: role.name,
		permissions: role.permissions,
		id: role._id.toString(),
	};
}

export function assignRolesMongoQuery(roles: Role[]) {
	return {
		$push: {
			roles: {
				$each: roles.map(roleToUserRole),
			},
		},
	};
}
