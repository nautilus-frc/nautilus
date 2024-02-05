import { Context } from "elysia";
import { log, logError } from "../../../../util/logging";
import { Meetings } from "../../../../models/usersDB/meetings/MeetingModel";
import { meetingResponse } from "../../../../util/meetings";

export default async function editMeeting({
	params: { meetingId },
	body,
	set,
}: Context<{
	params: { meetingId: string };
	body: Partial<{
		type: string;
		description: string;
		startTime: number;
		endTime: number;
		value: number;
		attendancePeriod: string;
	}>;
}>) {
	try {
		const updated = await Meetings.findByIdAndUpdate(meetingId, body, {
			new: true,
		});
		if (!updated) {
			set.status = 404;
			return { message: "Meeting not found" };
		}
		set.status = 200;
		return meetingResponse(updated);
	} catch (e) {
		set.status = 500;
		logError("Error editing meeting" + e);
		return { message: "Error editing meeting" };
	}
}
