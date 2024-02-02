import { Context } from "elysia";
import { logError } from "../../../../util/logging";
import { Users } from "../../../../models/usersDB/UserModel";

export async function deleteUser({
	params: { userId },
	set,
}: Context<{ params: Record<"userId", string> }>) {
	try {
		const deletedUser = await Users.findByIdAndDelete(userId);
		if (!deletedUser) {
			set.status = 404;
			return { message: "User not found" };
		}
		set.status = 200;
		return { message: "User deleted" };
	} catch (e) {
		set.status = 500;
		logError("Failed to delete user " + userId + " from database");
		return { message: "Error deleting user from database" };
	}
}
