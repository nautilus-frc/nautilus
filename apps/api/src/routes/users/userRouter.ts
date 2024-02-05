import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { TAuthHeaders, TServerMessage } from "../../models/global/ElysiaModels";
import {
	TLimitedUser,
	TUserWithToken,
	TUserNoToken,
	TUserPermissions,
	TUserRaw,
} from "../../models/usersDB/users/ElysiaSchemas";
import { ACCOUNT_LEVEL, protect, protectAndBind } from "../../util/protect";
import { resetPassword } from "../../util/resetPassword";
import { deleteUser } from "./handlers/[user]/deleteUser";
import { getUserAdmin, getUserDefault } from "./handlers/[user]/getUser";
import updateUser, { TUserUpdate } from "./handlers/[user]/updateUser";
import { PASSWORD_RESET_LIMIT, forgot } from "./handlers/forgot";
import {
	getUsersAdmin,
	getUsersDefault,
	getUsersRaw,
} from "./handlers/getUsers";
import { login } from "./handlers/login";
import { deleteMe } from "./handlers/me/deleteMe";
import { getMe } from "./handlers/me/getMe";
import updateMe from "./handlers/me/updateMe";
import { register } from "./handlers/register";

export const usersRouter = new Elysia()
	.use(bearer())
	.group("/users", { detail: { tags: ["Users"] } }, (app) =>
		app
			.get(
				"/",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							getUsersAdmin,
							{
								fallback: getUsersDefault,
								fallbackLevel: ACCOUNT_LEVEL.BASE,
							}
							// getUsersDefault,
							// ACCOUNT_LEVEL.BASE
						)
					)(ctx),
				{
					response: {
						200: t.Union([
							t.Array(TLimitedUser),
							t.Array(TUserNoToken),
						]),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
						404: TServerMessage,
						// default: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Returns a list of all users. Access level needed: Admin (account level 3+) to view all user data, base (level 1+) to view limited user data",
					},
				}
			)
			.get(
				"/raw",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.SUPERUSER,
							getUsersRaw
						)
					)(ctx),
				{
					response: {
						200: t.Array(TUserRaw),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Returns a list of users as their raw MongoDB documents. Superuser access needed (account level 4+)",
					},
				}
			)
			.post("/login", async (ctx) => await login(ctx), {
				body: t.Object({
					username: t.String(),
					password: t.String(),
				}),
				response: {
					200: TUserWithToken,
					400: TServerMessage,
					401: TServerMessage,
					404: TServerMessage,
					500: TServerMessage,
				},
			})
			.post("/register", async (ctx) => await register(ctx), {
				body: t.Object({
					firstname: t.String(),
					lastname: t.String(),
					username: t.String(),
					email: t.String(),
					password: t.String(),
					phone: t.String(),
					subteam: t.String(),
					grade: t.Numeric(),
				}),
				response: {
					200: TUserWithToken,
					400: TServerMessage,
					401: TServerMessage,
					403: TServerMessage,
					500: TServerMessage,
				},
			})
			.post("/forgot-password", async (ctx) => await forgot(ctx), {
				body: t.Object({
					email: t.String(),
				}),
				response: {
					200: TServerMessage,
					400: TServerMessage,
					404: TServerMessage,
					429: TServerMessage,
				},
				detail: {
					"description":
						"If the email is associated with an existing user account, sends an email with a one-time password to reset the password. Users are limited to " +
						PASSWORD_RESET_LIMIT +
						" password reset requests per week",
				},
			})
			.post(
				"/reset-password",
				async ({ body, set }) => {
					const { newPassword, email, otp } = body;
					const { data, code } = await resetPassword(
						otp,
						newPassword,
						email
					);
					set.status = code;
					return data;
				},
				{
					body: t.Object({
						email: t.String(),
						newPassword: t.String(),
						otp: t.String(),
					}),
					response: {
						201: TServerMessage,
						400: TServerMessage,
						500: TServerMessage,
					},
				}
			)
			.get(
				"/me",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							getMe
						)
					)(ctx),
				{
					response: {
						200: TUserWithToken,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Returns the currently authenticated user's data",
					},
				}
			)
			.put(
				"/me",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							updateMe
						)
					)(ctx),
				{
					body: t.Object({
						firstname: t.Optional(t.String()),
						lastname: t.Optional(t.String()),
						email: t.Optional(t.String()),
						phone: t.Optional(t.String()),
						subteam: t.Optional(t.String()),
						grade: t.Optional(t.Numeric()),
					}),
					response: {
						201: TUserWithToken,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Updates the currently authenticated user's information",
					},
				}
			)
			.delete(
				"/me",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							deleteMe
						)
					)(ctx),
				{
					response: {
						200: TServerMessage,
						404: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Deletes the currently authenticated user's account",
					},
				}
			)
			.get(
				"/:user",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							getUserAdmin,
							{
								fallback: getUserDefault,
								fallbackLevel: ACCOUNT_LEVEL.BASE,
							}
						)
					)(ctx),
				{
					response: {
						200: t.Union([TLimitedUser, TUserNoToken]),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Look up user by username, email, or UUID. Admin access (account level 3+) required to view full data, base (level 1+) to view limited user data",
					},
				}
			)
			.put(
				"/:user",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							updateUser
						)
					)(ctx),
				{
					body: t.Object({
						firstname: t.Optional(t.String()),
						lastname: t.Optional(t.String()),
						email: t.Optional(t.String()),
						phone: t.Optional(t.String()),
						subteam: t.Optional(t.String()),
						grade: t.Optional(t.Numeric()),
						username: t.Optional(t.String()),
						accountType: t.Optional(t.Numeric()),
						accountUpdateVersion: t.Optional(t.Numeric()),
						roles: t.Optional(
							t.Array(
								t.Object({
									name: t.String(),
									permissions: TUserPermissions,
									id: t.String(),
								})
							)
						),
					} satisfies Record<keyof TUserUpdate, unknown>),
					response: {
						201: TUserNoToken,
						404: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Look up user by email, username, or UUID and update the user's information. Admin access (account level 3+) required",
					},
				}
			)
			.delete(
				"/:user",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							deleteUser
						)
					)(ctx),
				{
					response: {
						200: TServerMessage,
						404: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Look up user by email, username, or UUID and delete the user's account. Admin access (account level 3+) required",
					},
				}
			)
	);
