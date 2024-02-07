import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { getSeasons } from "./handlers/getSeasons";
import { TSeason } from "../../models/scoutingDB/seasonsElysia";
import { TAuthHeaders, TServerMessage } from "../../models/global/ElysiaModels";
import { ACCOUNT_LEVEL, protect } from "../../util/users/protect";
import createSeason from "./handlers/createSeason";
import deleteSeason from "./handlers/[season]/deleteSeason";
import getComps from "./handlers/[season]/competitions/getCompetitions";
import addCompetition from "./handlers/[season]/competitions/addCompetition";
import removeCompetition from "./handlers/[season]/competitions/removeCompetition";
import updateSeason from "./handlers/[season]/updateSeason";
import getAttendance from "./handlers/[season]/attendance/get";
import addAttendancePeriods from "./handlers/[season]/attendance/add";
import removeAttendancePeriods from "./handlers/[season]/attendance/remove";

export const seasonRouter = new Elysia().use(bearer()).group(
	"/seasons",
	{
		detail: {
			tags: ["Seasons"],
		},
	},
	(app) =>
		app
			.get("/", async (ctx) => await getSeasons(ctx), {
				response: {
					200: t.Array(TSeason),
					404: TServerMessage,
					500: TServerMessage,
				},
				detail: {
					description:
						"Get all seasons. Filter with query search params.",
				},
			})
			.post(
				"/",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							createSeason
						)
					)(ctx),
				{
					body: TSeason,
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Create a season record. Requires Admin (Account level 3+). Season records contain the year, name, competitions your tema will attend, and attendance periods. Competitions and attendance periods can be added or removed after creation.",
					},
					headers: TAuthHeaders,
				}
			)
			.delete(
				"/:year",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							deleteSeason
						)
					)(ctx),
				{
					params: t.Object({
						year: t.Numeric(),
					}),
					response: {
						200: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Delete a season. Requires Admin (Account level 3+)",
					},
					headers: TAuthHeaders,
				}
			)
			.put(
				"/:year",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							updateSeason
						)
					)(ctx),
				{
					body: t.Partial(TSeason),
					params: t.Object({
						year: t.Numeric(),
					}),
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Update a season record. Requires Admin (Account level 3+).",
					},
					headers: TAuthHeaders,
				}
			)
			.get("/:year/competitions", async (ctx) => await getComps(ctx), {
				params: t.Object({
					year: t.Numeric(),
				}),
				response: {
					200: t.Array(t.String()),
					400: TServerMessage,
					404: TServerMessage,
					500: TServerMessage,
				},
				detail: {
					description:
						"Get a list of competitions your team will be attending for a season",
				},
			})
			.put(
				"/:year/competitions/add",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							addCompetition
						)
					)(ctx),
				{
					params: t.Object({
						year: t.Numeric(),
					}),
					body: t.Array(t.String()),
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Add one or more competitions to the list for your team's season. Requires Admin (Account level 3+). The list of competitions in the season record will determine what competitions are available to scout for in the companion app.",
					},
					headers: TAuthHeaders,
				}
			)
			.put(
				"/:year/competitions/remove",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							removeCompetition
						)
					)(ctx),
				{
					params: t.Object({
						year: t.Numeric(),
					}),
					body: t.Array(t.String()),
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Remove one or more competitions from the list for your team's season. Requires Admin (Account level 3+). The list of competitions in the season record will determine what competitions are available to scout for in the companion app.",
					},
					headers: TAuthHeaders,
				}
			)
			.get("/:year/attendance", async (ctx) => await getAttendance(ctx), {
				params: t.Object({ year: t.Numeric() }),
				response: {
					200: t.Array(t.String()),
					400: TServerMessage,
					404: TServerMessage,
					500: TServerMessage,
				},
				detail: {
					description:
						"Get a list of attendance periods for a season",
				},
			})
			.put(
				"/:year/attendance/add",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							addAttendancePeriods
						)
					)(ctx),
				{
					params: t.Object({ year: t.Numeric() }),
					body: t.Array(t.String()),
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Add one or more attendance periods to the list for your team's season. Requires Admin (Account level 3+). The list of attendance periods in the season record will determine what attendance periods meetings can be scheduled for in the app",
					},
					headers: TAuthHeaders,
				}
			)
			.put(
				"/:year/attendance/remove",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							removeAttendancePeriods
						)
					)(ctx),
				{
					params: t.Object({
						year: t.Numeric(),
					}),
					body: t.Array(t.String()),
					response: {
						200: TSeason,
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Remove one or more attendance periods from the list for your team's season. Requires Admin (Account level 3+). The list of attendance periods in the season record will determine what attendance periods meetings can be scheduled for in the app",
					},
					headers: TAuthHeaders,
				}
			)
);
