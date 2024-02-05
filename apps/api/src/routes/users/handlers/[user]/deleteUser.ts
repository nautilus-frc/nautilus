import { Context } from "elysia";
import { logError } from "../../../../util/logging";
import { Users } from "../../../../models/usersDB/users/UserModel";
import mongoose from "mongoose";

export async function deleteUser({
	params: { user: userId },
	set,
}: Context<{ params: Record<"user", string> }>) {
	try {
		const user = mongoose.Types.ObjectId.isValid(userId)
			? await Users.findById(userId)
			: await Users.findOne({
					$or: [{ username: userId }, { email: userId }],
				});
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		const deletedUser = await Users.findByIdAndDelete(user._id);
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
