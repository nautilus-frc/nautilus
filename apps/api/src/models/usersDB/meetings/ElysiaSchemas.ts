import { t } from "elysia";
import { IMeeting } from "./MeetingModel";
import { meetingInfo, meetingResponse } from "../../../util/meetings";

export const TMeeting = t.Object({
	_id: t.String(),
	type: t.String(),
	description: t.String(),
	startTime: t.Numeric(),
	endTime: t.Numeric(),
	value: t.Numeric(),
	createdBy: t.String(),
	attendancePeriod: t.String(),
	isArchived: t.Boolean(),
} satisfies Record<keyof ReturnType<typeof meetingResponse>, unknown>);

export const TMeetingInfo = t.Object({
	type: t.String(),
	description: t.String(),
	startTime: t.Numeric(),
	endTime: t.Numeric(),
	value: t.Numeric(),
	attendancePeriod: t.String(),
} satisfies Record<keyof ReturnType<typeof meetingInfo>, unknown>);
