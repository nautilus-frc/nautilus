import { Elysia } from "elysia";
import { Meeting, Meetings } from "../../models/usersDB/meetings/MeetingModel";
import { IUser, User, Users } from "../../models/usersDB/users/UserModel";
import cron from "@elysiajs/cron";
import { log, logError } from "../general/logging";

async function validateUserAttendanceForMany(
	users: User[],
	meetings: Meeting[]
) {
	try {
		const updated: Array<{
			updateOne: {
				filter: { _id: User["_id"] };
				update: { attendance: User["attendance"] };
			};
		}> = [];
		for (const user of users) {
			const attendance = user.attendance;
			const out: User["attendance"] = {};
			for (const [k, v] of Object.entries(attendance)) {
				let hours = 0;
				const logs: User["attendance"][string]["logs"] = [];
				for (const { meetingId, verifiedBy } of v.logs) {
					const meeting = meetings.find(
						(m) => m._id.toString() === meetingId
					);
					if (meeting) {
						hours += meeting.value;
						logs.push({ meetingId, verifiedBy });
					}
				}
				out[k] = { totalHoursLogged: hours, logs };
			}
			updated.push({
				updateOne: {
					filter: { _id: user._id },
					update: { attendance: out },
				},
			});
		}
		const res = await Users.bulkWrite(updated);
		log(JSON.stringify(res));
	} catch (e) {
		logError("Error validating user attendance: " + e);
	}
}

export const userAttendanceCron = new Elysia().use(
	cron({
		name: "validateUserAttendance",
		pattern: "*/20 * * * *",
		async run() {
			const users = await Users.find({});
			const meetings = await Meetings.find({});
			validateUserAttendanceForMany(users, meetings);
		},
	})
);
