import { Elysia, t } from "elysia";
import { ACCOUNT_LEVEL, protect } from "../../util/protect";
import bearer from "@elysiajs/bearer";
import createRole from "./handlers/createRole";
import { Permissions } from "../../models/usersDB/users/UserRoleModel";
import { TAuthHeaders, TServerMessage } from "../../models/global/ElysiaModels";
import getRoles from "./handlers/getRoles";
import {
	TRole,
	TUserWithToken,
	TUserNoToken,
	TUserPermissions,
} from "../../models/usersDB/users/ElysiaSchemas";
import assignRole from "./handlers/[role]/assignRole";
import deleteRole from "./handlers/[role]/deleteRole";
import updateRole from "./handlers/[role]/updateRole";
import revokeRole from "./handlers/[role]/revokeRole";

export const rolesRouter = new Elysia().group(
	"/roles",
	{ detail: { tags: ["Roles"] } },
	(app) =>
		app
			.use(bearer())
			.get(
				"/",
				async (ctx) =>
					(await protect(ctx.bearer, ACCOUNT_LEVEL.ADMIN, getRoles))(
						ctx
					),
				{
					response: {
						200: t.Array(TRole),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"View list of all roles. Requires account type admin (level 3+).",
					},
				}
			)
			.post(
				"/",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							createRole
						)
					)(ctx),
				{
					body: t.Object({
						name: t.String(),
						permissions: t.Partial(TUserPermissions),
					}),
					response: {
						201: TRole,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Create a new user role. Requires account type admin (level 3+).",
					},
				}
			)
			.put(
				"/:roleId",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							updateRole
						)
					)(ctx),
				{
					body: t.Object({
						name: t.Optional(t.String()),
						permissions: t.Optional(t.Partial(TUserPermissions)),
					}),
					response: {
						201: TRole,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Update a role's name or associated permissions. Requires account type admin (level 3+). Automatically updates roles and permissions for all users who have the role",
					},
				}
			)
			.delete(
				"/:roleId",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							deleteRole
						)
					)(ctx),
				{
					response: {
						200: TServerMessage,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Delete a role. Requires account type admin (level 3+). Will automatically remove the role from all users who had the role.",
					},
				}
			)
			.put(
				"/:roleId/assign",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							assignRole
						)
					)(ctx),
				{
					body: t.Array(t.String()),
					response: {
						201: t.Array(TUserNoToken),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Assign a role to a list of users (accepts a mixed list of email, username, or UUID). Requires account type admin (level 3+). Returns list of updated user accounts. Aborts operation if any user update fails, and rolls back all changes",
					},
				}
			)
			.put(
				"/:roleId/revoke",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							revokeRole
						)
					)(ctx),
				{
					body: t.Array(t.String()),
					headers: TAuthHeaders,
					response: {
						201: t.Array(TUserNoToken),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Revoke a role from a list of users (accepts a mixed list of username, email, or UUID). Requires account type admin (level 3+). Returns list of updated user accounts. Aborts operation if any user update fails, and rolls back all changes",
					},
				}
			)
);
