import Bottleneck from "bottleneck";
import { Context } from "elysia";
import { Resend } from "resend";
import { log, logError } from "../../../util/logging";
import { message } from "../../../util/json";
import { User, Users } from "../../../models/usersDB/users/UserModel";
import { randStr } from "../../../util/rand";
import bcrypt from "bcrypt";
import { Render } from "../../../components/render";
import { PasswordResetEmail } from "../../../components/resetemail";

const RESEND_KEY = process.env.RESEND_KEY || "";
const FROM_ADDR = process.env.FROM_ADDR || "";

export const PASSWORD_RESET_LIMIT = 5;

const PASSWORD_RESET_LIMIT_TIME = 7 * 24 * 3600 * 1000;

const resend = new Resend(RESEND_KEY);

//prevent exceeding free tier limit of Resend
const lm = new Bottleneck({
	minTime: 2000,
	maxConcurrent: 1,
	reservoir: 100,
	reservoirRefreshInterval: 24 * 3600 * 1000,
	reservoirRefreshAmount: 100,
});

export async function forgot({
	body,
	set,
	headers,
}: Context<{ body: { email: string } }>) {
	const { email } = body;
	const host = headers["host"] ?? process.env.HOST ?? "";
	log("host: " + host);
	log("Password reset requested for " + email);
	const { text, code } = await handleForgot(email, host);
	set.status = code;
	return message(text);
}

export async function handleForgot(
	email: string,
	host: string
): Promise<{ ok: boolean; text: string; code: number }> {
	try {
		const user = await Users.findOne({ email });

		if (!user) return { ok: false, text: "User not found", code: 404 };

		if (
			(user.rateLimit?.count ?? 0) >= PASSWORD_RESET_LIMIT &&
			Date.now() < (user.rateLimit?.expiresAt ?? -1)
		) {
			// set.status = 429;
			// return message(
			// 	"You have requested too many password resets, try again in 1 week"
			// );
			return {
				ok: false,
				text: "You have made too many requests, try again in 1 week",
				code: 429,
			};
		}

		const rlim =
			user.rateLimit?.expiresAt && Date.now() > user.rateLimit.expiresAt
				? { $unset: { rateLimit: "" } }
				: {
						rateLimit: {
							count: (user.rateLimit?.count ?? 0) + 1,
							expiresAt: Date.now() + PASSWORD_RESET_LIMIT_TIME,
						} satisfies User["rateLimit"],
					};

		const exp = Date.now() + 3 * 24 * 3600 * 1000; //3 days
		const otp = randStr(8).toUpperCase();
		const hashed = await bcrypt.hash(otp, await bcrypt.genSalt(10));

		const updatedUser = await Users.findByIdAndUpdate(
			user._id,
			{
				forgotPassword: {
					code: hashed,
					expiresAt: exp,
				},
				...rlim,
			},
			{
				new: true,
			}
		);

		if (!updatedUser)
			return {
				ok: false,
				text: "Error requesting password reset",
				code: 500,
			};

		const html = Render(<PasswordResetEmail otp={otp} host={host} />);

		const mailed = await tryEmail(
			{
				from: FROM_ADDR,
				to: email,
				subject: "Password Reset",
				html: html,
			},
			3
		);

		if (!mailed) {
			await Users.findByIdAndUpdate(
				user._id,
				{
					$unset: { forgotPassword: "", rateLimit: "" },
				},
				{
					new: true,
				}
			);
			return {
				ok: false,
				text: "We had trouble reaching your email, please try again",
				code: 500,
			};
		}

		return {
			ok: true,
			text: "Succesfully requested password reset. Check your email for a link and code.",
			code: 200,
		};
	} catch (e) {
		logError("Error requesting password reset for " + email + ": " + e);
		return {
			ok: false,
			text: "Error requesting password reset",
			code: 500,
		};
	}
}

interface Payload {
	from: string;
	to: string;
	subject: string;
	html: string;
}

type Success = boolean;

async function tryEmail(payload: Payload, tries: number): Promise<Success> {
	if (tries <= 0) {
		return false;
	}
	try {
		const { data, error } = await lm.schedule(() => {
			return resend.emails.send(payload);
		});

		if (!error) {
			log(
				"Password reset email sent to " +
					payload.to +
					": " +
					JSON.stringify(data)
			);
			return true;
		}
		logError(
			`Error sending password reset email for ${payload.to}: ${error};\n Retrying ${tries} more times`
		);
		return await tryEmail(payload, tries - 1);
	} catch (e) {
		logError(
			`Error sending password reset email for ${payload.to}: ${e};\n Retrying ${tries} more times`
		);
		return await tryEmail(payload, tries - 1);
	}
}
