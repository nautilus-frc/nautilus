import { Context } from "elysia";
import { resetPassword } from "../../util/resetPassword";
import ErrorPage from "./components/error";
import ResetPasswordSuccessPage from "./components/success";

export async function resetHandler({
	body,
	set,
}: Context<{
	body: {
		email: string;
		newPassword: string;
		confirmNewPassword: string;
		otp: string;
	};
}>) {
	set.status = 200;
	const { email, newPassword, confirmNewPassword, otp } = body;
	if (newPassword !== confirmNewPassword) {
		return <ErrorPage message="Passwords do not match" />;
	}
	const { success, data } = await resetPassword(otp, newPassword, email);
	if (!success) {
		return <ErrorPage message={data.message} />;
	}
	return <ResetPasswordSuccessPage />;
}
