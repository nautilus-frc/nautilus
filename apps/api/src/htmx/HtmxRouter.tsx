import { html } from "@elysiajs/html";
import { Elysia, t } from "elysia";
import HtmxBase from "./HtmxBase";
import ResetPasswordPage from "./reset/page";
import { resetHandler } from "./reset/routehandler";
import ResetPasswordSuccessPage from "./reset/components/success";
import ForgotPasswordPage from "./forgot/page";
import forgotHandler from "./forgot/routehandler";

export const htmxRouter = new Elysia({ prefix: "/pages" })
	.use(html())
	.get("/reset-password", ({ html }) =>
		html(
			<HtmxBase title="Reset Password">
				<ResetPasswordPage />
			</HtmxBase>
		)
	)
	.post(
		"/reset",
		async (c) => {
			return await resetHandler(c);
		},
		{
			body: t.Object({
				email: t.String(),
				newPassword: t.String(),
				confirmNewPassword: t.String(),
				otp: t.String(),
			}),
		}
	)
	.get("/forgot-password", ({ html }) =>
		html(
			<HtmxBase title="Forgot Password">
				<ForgotPasswordPage />
			</HtmxBase>
		)
	)
	.post("/forgot", async (c) => await forgotHandler(c), {
		body: t.Object({
			email: t.String(),
		}),
	});
