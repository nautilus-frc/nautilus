import { Context } from "elysia";
import { logError } from "../../../util/general/logging";
import { Seasons } from "../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../util/seasons/seasonResponse";

export async function getSeasons({ set, query }: Context) {
	try {
		const seasons = await Seasons.find({ ...query });
		if (seasons.length < 1) {
			set.status = 404;
			return { message: "No seasons found" };
		}
		return seasons.map(seasonResponse);
	} catch (e) {
		await logError("Error getting seasons: " + e);
		set.status = 500;
		return { message: "Internal server error getting seasons" };
	}
}
