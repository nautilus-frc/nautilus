import { Context } from "elysia";
import { Meetings } from "../../../../models/usersDB/meetings/MeetingModel";
import { logError } from "../../../../util/logging";

export default async function deleteMeeting({
	params: { meetingId },
	set,
}: Context<{
	params: { meetingId: string };
}>) {
	try {
		const meeting = await Meetings.findByIdAndDelete(meetingId);
		if (!meeting) {
			set.status = 404;
			return { message: "No meeting found" };
		}
		set.status = 200;
		return { message: "Meeting deleted" };
	} catch (e) {
		set.status = 500;
		logError("Error deleting meeting: " + e);
		return { message: "Error deleting meeting" };
	}
}
