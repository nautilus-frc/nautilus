import { Context } from "elysia";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import { logError } from "../../../../util/general/logging";
import { findUser, userResponseNoToken } from "../../../../util/users/userUtil";
import { ACCOUNT_LEVEL } from "../../../../util/users/protect";

export async function verifyUser(
	me: User,
	{
		params: { user: userId },
		set,
	}: Context<{ params: Record<"user", string> }>
) {
	try {
		const user = await findUser(userId);
		if (!user) {
			set.status = 404;
			return { message: "User not found" };
		}
		if (user.accountType >= ACCOUNT_LEVEL.BASE) {
			set.status = 400;
			return { message: "User is already verified" };
		}
		if (!canVerify(me, user)) {
			set.status = 403;
			return {
				message: "You do not have permission to verify this user",
			};
		}
		const updated = await Users.findByIdAndUpdate(user._id, {
			accountType: ACCOUNT_LEVEL.BASE,
		});
		if (!updated) {
			set.status = 500;
			return { message: "Error verifying user" };
		}
		set.status = 200;
		return userResponseNoToken(updated);
	} catch (e) {
		set.status = 500;
		logError(`Error verifying user ${userId}: ${e}`);
		return { message: "Internal Server Error verifying user" };
	}
}

function canVerify(me: User, verifying: User) {
	return (
		me.accountType >= ACCOUNT_LEVEL.ADMIN ||
		(me.accountType == ACCOUNT_LEVEL.LEAD &&
			me.subteam == verifying.subteam)
	);
}
