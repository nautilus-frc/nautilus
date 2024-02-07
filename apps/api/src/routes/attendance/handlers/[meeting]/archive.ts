import { Context } from "elysia";
import { logError } from "../../../../util/general/logging";
import { Meetings } from "../../../../models/usersDB/meetings/MeetingModel";

export default async function archiveMeeting({
	params: { meetingId },
	set,
}: Context<{
	params: { meetingId: string };
}>) {
	try {
		const meeting = await Meetings.findById(meetingId);
		if (!meeting) {
			set.status = 404;
			return { message: "Meeting not found" };
		}
		meeting.isArchived = !meeting.isArchived;
		const updated = await meeting.save();
		set.status = 200;
		return {
			message: `Meeting successfully ${updated.isArchived ? "archived" : "unarchived"}`,
		};
	} catch (e) {
		logError("Error archiving meeting" + e);
		set.status = 500;
		return { message: "Error archiving meeting" };
	}
}
