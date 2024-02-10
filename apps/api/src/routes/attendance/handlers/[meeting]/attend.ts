import { Context } from "elysia";
import { User, Users } from "../../../../models/usersDB/users/UserModel";
import { Meetings } from "../../../../models/usersDB/meetings/MeetingModel";
import {
	userResponseToken,
	validateUserAttendance,
} from "../../../../util/users/userUtil";
import { logError } from "../../../../util/general/logging";

export default async function attendMeeting(
	me: User,
	{
		set,
		body,
		params: { meetingId },
	}: Context<{
		body: {
			tapTime: number;
			verifiedBy: string;
		};
		params: {
			meetingId: string;
		};
	}>
) {
	try {
		const meeting = await Meetings.findById(meetingId);
		const { tapTime, verifiedBy } = body;
		if (!meeting) {
			set.status = 404;
			return { message: "Meeting not found" };
		}
		if (meeting.startTime > tapTime || meeting.endTime < tapTime) {
			set.status = 400;
			return { message: "Attendance was not logged during meeting time" };
		}

		const attendance = await validateUserAttendance(me.attendance);

		if (!(meeting.attendancePeriod in attendance)) {
			attendance[meeting.attendancePeriod] = {
				logs: [],
				totalHoursLogged: 0,
			};
		}

		if (
			attendance[meeting.attendancePeriod].logs.find(
				(it) => it.meetingId === meetingId
			)
		) {
			set.status = 400;
			return { message: "You have already attended this meeting" };
		}

		attendance[meeting.attendancePeriod].logs.push({
			meetingId,
			verifiedBy,
		});
		attendance[meeting.attendancePeriod].totalHoursLogged += meeting.value;

		const updatedUser = await Users.findByIdAndUpdate(
			me._id,
			{ attendance },
			{ new: true }
		);

		if (!updatedUser) {
			set.status = 500;
			return { message: "Error updating user attendance" };
		}

		set.status = 200;
		return userResponseToken(updatedUser);
	} catch (e) {
		set.status = 500;
		logError(
			"Error logging attendance for user " +
				me.username +
				" at meeting " +
				meetingId +
				": " +
				e
		);
		return {
			message:
				"A server error occurred while verifying attendance, please try again",
		};
	}
}
