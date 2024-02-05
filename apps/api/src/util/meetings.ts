import { Meeting, IMeeting } from "../models/usersDB/meetings/MeetingModel";

export function meetingResponse(meeting: Meeting) {
	return {
		_id: meeting._id.toString(),
		type: meeting.type,
		description: meeting.description,
		startTime: meeting.startTime,
		endTime: meeting.endTime,
		value: meeting.value,
		createdBy: meeting.createdBy,
		attendancePeriod: meeting.attendancePeriod,
		isArchived: meeting.isArchived,
	};
}

export function meetingInfo(meeting: Meeting) {
	return {
		type: meeting.type,
		description: meeting.description,
		startTime: meeting.startTime,
		endTime: meeting.endTime,
		value: meeting.value,
		attendancePeriod: meeting.attendancePeriod,
	};
}
