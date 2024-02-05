import { Context } from "elysia";
import { User } from "../../../models/usersDB/users/UserModel";
import {
	MeetingType,
	Meetings,
} from "../../../models/usersDB/meetings/MeetingModel";
import { logError } from "../../../util/general/logging";
import { meetingResponse } from "../../../util/meetings";
import { formatUserRoles } from "../../../util/users/userUtil";

export async function createMeeting(
	user: User,
	{
		body,
		set,
	}: Context<{
		body: {
			type: string;
			description: string;
			startTime: number;
			endTime: number;
			value: number;
			attendancePeriod: string;
		};
	}>
) {
	try {
		const meeting = await Meetings.create({
			...body,
			type: MeetingType.of(body.type),
			createdBy: user._id,
			isArchived: false,
		});
		if (!meeting) {
			set.status = 500;
			return { message: "Error creating meeting" };
		}
		set.status = 201;
		return meetingResponse(meeting);
	} catch (e) {
		set.status = 500;
		logError("Error creating meeting: " + e);
		return { message: "Error creating meeting" };
	}
}
