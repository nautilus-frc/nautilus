import { Users } from "../models/usersDB/users/UserModel";
import bcrypt from "bcrypt";
import { logError } from "./logging";
import { MessageT } from "./json";

interface Result {
	success: boolean;
	data: MessageT;
	code: number;
}

export async function resetPassword(
	otp: string,
	newPassword: string,
	email: string
): Promise<Result> {
	try {
		const user = await Users.findOne({ email });
		if (!user)
			return {
				success: false,
				data: { message: "User not found" },
				code: 400,
			};
		if (!user.forgotPassword?.code || !user.forgotPassword?.expiresAt)
			return {
				success: false,
				data: {
					message:
						"User has not requested password reset or reset has expired",
				},
				code: 400,
			};
		if (Date.now() > user.forgotPassword.expiresAt) {
			return {
				success: false,
				data: { message: "Password reset code has expired" },
				code: 400,
			};
		}

		const isMatch = await bcrypt.compare(
			otp.toUpperCase(),
			user.forgotPassword.code
		);
		if (!isMatch)
			return {
				success: false,
				data: { message: "Incorrect password reset code" },
				code: 400,
			};

		const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
		const updated = await Users.findByIdAndUpdate(
			user._id,
			{
				password: hash,
				$unset: { forgotPassword: "" },
			},
			{
				new: true,
			}
		);
		if (updated)
			return {
				success: true,
				data: { message: "Password reset successfully" },
				code: 201,
			};
		return {
			success: false,
			data: { message: "Password reset failed" },
			code: 500,
		};
	} catch (e) {
		logError("Error resetting password of user: " + email + " :" + e);
		return {
			success: false,
			data: { message: "Internal server error" },
			code: 500,
		};
	}
}
