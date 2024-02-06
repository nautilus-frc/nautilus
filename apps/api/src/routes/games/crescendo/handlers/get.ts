import { Context } from "elysia";
import { logError } from "../../../../util/general/logging";
import { Crescendos } from "../../../../models/scoutingDB/games/crescendo/Crescendo";
import crescendoResponse from "../util/format";
import { User } from "../../../../models/usersDB/users/UserModel";

export default async function getCrescendos({ set, query }: Context) {
	try {
		const data = await Crescendos.find({ ...query });
		if (!data || data.length < 1) {
			set.status = 404;
			return { message: "No scouting submissions found" };
		}
		set.status = 200;
		return data.map(crescendoResponse);
	} catch (e) {
		set.status = 500;
		await logError("Error getting scouting form: " + e);
		return { message: "Internal server error getting scouting form" };
	}
}

export async function getMySubmissions(user: User, { set, query }: Context) {
	try {
		const { createdBy, ...q } = query;
		const data = await Crescendos.find({ ...q, createdBy: user._id });
		if (!data || data.length < 1) {
			set.status = 404;
			return { message: "No scouting submissions found" };
		}
		set.status = 200;
		return data.map(crescendoResponse);
	} catch (e) {
		set.status = 500;
		await logError("Error getting scouting form: " + e);
		return { message: "Internal server error getting scouting form" };
	}
}
