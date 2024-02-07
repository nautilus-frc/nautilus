import { Meetings } from "../../../models/usersDB/meetings/MeetingModel";
import { meetingInfo } from "../../../util/meetings";
import { logError } from "../../../util/general/logging";
import mongoose from "mongoose";
import { User, Users } from "../../../models/usersDB/users/UserModel";
import { Context } from "elysia";

export async function getMeetingInfo(ids: string[]) {
	try {
		const meetings = await Meetings.find({
			_id: {
				$in: ids.filter((it) => mongoose.Types.ObjectId.isValid(it)),
			},
		});
		if (!meetings) {
			return { data: { message: "No meetings found" }, status: 404 };
		}
		return { data: meetings.map((it) => meetingInfo(it)), status: 200 };
	} catch (e) {
		logError("Error getting meeting info: " + e);
		return { data: { message: "Error getting meeting info" }, status: 500 };
	}
}

export async function getMyLogs(me: User, { set }: Context) {
	try {
		const logs = Object.values(me.attendance)
			.map((it) => it.logs)
			.flat()
			.map(({ meetingId }) => meetingId);
		const { data, status } = await getMeetingInfo(logs);
		set.status = status;
		return data;
	} catch (e) {
		set.status = 500;
		logError("Error getting logs: " + e);
		return { message: "Error getting logs" };
	}
}

export async function getMeetingLogs({
	set,
	params: { user },
}: Context<{
	params: {
		user: string;
	};
}>) {
	try {
		const usr = mongoose.Types.ObjectId.isValid(user)
			? await Users.findById(user)
			: await Users.findOne({
					$or: [{ username: user }, { email: user }],
				});
		if (!usr) {
			set.status = 404;
			return { message: "User not found" };
		}
		const logs = Object.values(usr.attendance)
			.map((it) => it.logs)
			.flat()
			.map(({ meetingId }) => meetingId);
		const { data, status } = await getMeetingInfo(logs);
		set.status = status;
		return data;
	} catch (e) {
		set.status = 500;
		logError("Error getting meeting logs: " + e);
		return { message: "Error getting meeting logs" };
	}
}
