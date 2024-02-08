import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import {
	ACCOUNT_LEVEL,
	protect,
	protectAndBind,
} from "../../../util/users/protect";
import submitCrescendo from "./handlers/post";
import {
	TCrescendoBody,
	TCrescendoResponse,
} from "../../../models/scoutingDB/games/crescendo/elysiamodels";
import {
	TAuthHeaders,
	TServerMessage,
} from "../../../models/global/ElysiaModels";
import getCrescendos, { getMySubmissions } from "./handlers/get";

export const crescendoRouter = new Elysia().use(bearer()).group(
	"/crescendo",
	{
		detail: {
			tags: ["Crescendo", "Scouting"],
		},
	},
	(app) =>
		app
			.post(
				"/",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.BASE,
							submitCrescendo,
							{ requiredPermissions: ["generalScouting"] }
						)
					)(ctx),
				{
					body: TCrescendoBody,
					headers: TAuthHeaders,
					response: {
						200: TCrescendoResponse,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Submit a scouting form for the Crescendo game. Requries base verification (account level 1+) and permission to submit general scouting forms.",
					},
				}
			)
			.get(
				"/",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.LEAD,
							getCrescendos,
							{ requiredPermissions: ["viewScoutingData"] }
						)
					)(ctx),
				{
					response: {
						200: t.Array(TCrescendoResponse),
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Get all scouting submissions for the Crescendo game. Requires lead verification (account level 2+) and permission to view scouting data.",
					},
				}
			)
			.get(
				"/mine",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							getMySubmissions
						)
					)(ctx),
				{
					response: {
						200: t.Array(TCrescendoResponse),
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Get all scouting submissions for the Crescendo game submitted by the logged in user.",
					},
					headers: TAuthHeaders,
				}
			)
);
