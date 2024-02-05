import { Role } from "../models/usersDB/users/UserRoleModel";

export const formatRoleResponse = ({ name, permissions, _id }: Role) => ({
	name,
	permissions,
	_id: _id.toString(),
});
