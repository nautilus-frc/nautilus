import { Context } from "elysia";
import { User } from "../../../models/usersDB/users/UserModel";
import { formatUserRoles } from "../../../util/users/userUtil";
import { Meetings } from "../../../models/usersDB/meetings/MeetingModel";
import { meetingResponse } from "../../../util/meetings";
import { log, logError } from "../../../util/general/logging";

export async function getAllMeetings(user: User, { query, set }: Context) {
	const { permissions } = formatUserRoles(user.roles, user.accountType);
	if (!permissions.viewMeetings) {
		set.status = 403;
		return { message: "You do not have permission to view meetings" };
	}
	try {
		const meetings = await Meetings.find({ ...query });
		if (!meetings) {
			set.status = 404;
			return { message: "No meetings found" };
		}
		set.status = 200;
		return meetings.map((it) => meetingResponse(it));
	} catch (e) {
		set.status = 500;
		logError("Error getting meetings: " + e);
		return { message: "Error getting meetings" };
	}
}

export async function getCurrentMeetings({ set, query }: Context) {
	try {
		const meetings = await Meetings.find({
			endTime: { $gt: Date.now() },
			isArchived: false,
			...query,
		});
		if (!meetings) {
			set.status = 404;
			return { message: "No meetings found" };
		}
		set.status = 200;
		return meetings.map((it) => meetingResponse(it));
	} catch (e) {
		set.status = 500;
		logError("Error getting meetings: " + e);
		return { message: "Error getting meetings" };
	}
}
