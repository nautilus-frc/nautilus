import mongoose, {
	HydratedDocumentFromSchema,
	InferSchemaType,
} from "mongoose";
import { usersDB } from "../../../config/db";

export const MeetingType = Object.freeze({
	"general": "general",
	"leads": "leads",
	"kickoff": "kickoff",
	"workshop": "workshop",
	"competition": "competition",
	"outreach": "outreach",
	"mentor": "mentor",
	"other": "other",
	of(str: string) {
		return str in this ? this[str as keyof typeof MeetingType] : this.other;
	},
});

export interface IMeeting {
	startTime: number;
	endTime: number;
	type: string;
	description: string;
	value: number;
	createdBy: string;
	attendancePeriod: string;
	isArchived: boolean;
}

const meetingSchema = new mongoose.Schema<IMeeting>({
	startTime: { type: Number, required: true }, //UNIX timestamp
	endTime: { type: Number, required: true }, //UNIX timestamp
	type: { type: String, required: true, lowercase: true, trim: true },
	description: { type: String, required: true, trim: true }, // name/description of meeting
	value: { type: Number, required: true }, // number of hours the meeting is worth (default 1 for meetings, 4 for competitions)
	createdBy: { type: String, required: true }, // username of the user who created the meeting
	attendancePeriod: { type: String, required: true }, // the attendance period the meeting is in, format is yearPeriod (ex. 2023fall)
	isArchived: { type: Boolean, required: false, default: false },
});

export type Meeting = HydratedDocumentFromSchema<typeof meetingSchema>;

export const Meetings = usersDB.model("meetings", meetingSchema);
