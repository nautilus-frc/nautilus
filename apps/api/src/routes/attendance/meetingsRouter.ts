import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { ACCOUNT_LEVEL, protect, protectAndBind } from "../../util/protect";
import { createMeeting } from "./handlers/createMeeting";
import {
	TMeeting,
	TMeetingInfo,
} from "../../models/usersDB/meetings/ElysiaSchemas";
import { TAuthHeaders, TServerMessage } from "../../models/global/ElysiaModels";
import { getAllMeetings, getCurrentMeetings } from "./handlers/getMeetings";
import {
	getMeetingInfo,
	getMeetingLogs,
	getMyLogs,
} from "./handlers/getMeetingInfo";
import { Meetings } from "../../models/usersDB/meetings/MeetingModel";
import deleteMeeting from "./handlers/[meeting]/delete";
import mongoose, { isValidObjectId } from "mongoose";
import archiveMeeting from "./handlers/[meeting]/archive";
import editMeeting from "./handlers/[meeting]/edit";
import attendMeeting from "./handlers/[meeting]/attend";
import { TUserWithToken } from "../../models/usersDB/users/ElysiaSchemas";

export const attendanceRouter = new Elysia()
	.use(bearer())
	.group("/attendance", { detail: { tags: ["Attendance"] } }, (app) =>
		app
			.post(
				"/meetings",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.LEAD,
							createMeeting,
							{ requiredPermissions: ["makeMeetings"] }
						)
					)(ctx),
				{
					body: TMeetingInfo,
					headers: TAuthHeaders,
					response: {
						201: TMeeting,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Create a new meeting. Requires account type lead (level 2+) and permission to create meetings.",
					},
				}
			)
			.get(
				"/meetings/info",
				async ({ set, query }) => {
					const { _id, ...rest } = query;
					if (_id && !isValidObjectId(_id)) {
						set.status = 400;
						return { message: "Invalid meeting ID" };
					}
					const idQuery = _id ? { _id } : {};
					const allMeetings = await Meetings.find({
						isArchived: false,
						...rest,
						...idQuery,
					});
					if (!allMeetings) {
						set.status = 404;
						return { message: "No meetings found" };
					}
					const { data, status } = await getMeetingInfo(
						allMeetings.map(({ _id }) => _id.toString())
					);
					set.status = status;
					return data;
				},
				{
					response: {
						200: t.Array(TMeetingInfo),
						404: TServerMessage,
						400: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Get information about non-archived meetings. Filter by query parameters.",
					},
				}
			)
			.get(
				"/meetings/all",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							getAllMeetings
						)
					)(ctx),
				{
					response: {
						200: t.Array(TMeeting),
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Get all meetings. Requires account type admin (level 3+).",
					},
				}
			)
			.get(
				"/meetings/current",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.LEAD,
							getCurrentMeetings,
							{ requiredPermissions: ["viewMeetings"] }
						)
					)(ctx),
				{
					response: {
						200: t.Array(TMeeting),
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Get all meetings that are not archived and have not ended. Requires account type lead (level 2+) and permission to view meetings.",
					},
				}
			)
			.delete(
				"/meetings/:meetingId",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.LEAD,
							deleteMeeting,
							{ requiredPermissions: ["deleteMeetings"] }
						)
					)(ctx),
				{
					response: {
						200: TServerMessage,
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Delete a meeting. Requires account type lead (level 2+) and permission to delete meetings.",
					},
				}
			)
			.put(
				"/meetings/:meetingId",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							editMeeting
						)
					)(ctx),
				{
					body: t.Partial(TMeetingInfo),
					response: {
						200: TMeeting,
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					detail: {
						description:
							"Edit a meeting. Requires account type admin (level 3+).",
					},
				}
			)
			.put(
				"/meetings/archive/:meetingId",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							archiveMeeting
						)
					)(ctx),
				{
					response: {
						200: TServerMessage,
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Toggle if the meeting is archived. Requires account type admin (level 3+).",
					},
				}
			)
			.put(
				"/meetings/attend/:meetingId",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							attendMeeting
						)
					)(ctx),
				{
					body: t.Object({
						tapTime: t.Numeric(),
						verifiedBy: t.String(),
					}),
					response: {
						200: TUserWithToken,
						404: TServerMessage,
						400: TServerMessage,
						403: TServerMessage,
						401: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Log attendance for a meeting. Returns updated user info with new attendance logs.",
					},
				}
			)
			.get(
				"/logs/me",
				async (ctx) =>
					(
						await protectAndBind(
							ctx.bearer,
							ACCOUNT_LEVEL.NONE,
							getMyLogs
						)
					)(ctx),
				{
					response: {
						200: t.Array(TMeetingInfo),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Get info about meetings attended by the currently authenticated user",
					},
				}
			)
			.get(
				"/logs/:user",
				async (ctx) =>
					(
						await protect(
							ctx.bearer,
							ACCOUNT_LEVEL.ADMIN,
							getMeetingLogs
						)
					)(ctx),
				{
					response: {
						200: t.Array(TMeetingInfo),
						400: TServerMessage,
						401: TServerMessage,
						403: TServerMessage,
						404: TServerMessage,
						500: TServerMessage,
					},
					headers: TAuthHeaders,
					detail: {
						description:
							"Get info about meetings attended by a user. Look up user by username, email, or UUID. Admin access (account level 3+) required.",
					},
				}
			)
	);
