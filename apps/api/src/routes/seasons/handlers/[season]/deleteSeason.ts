import { Context } from "elysia";
import { logError } from "../../../../util/general/logging";
import { Seasons } from "../../../../models/scoutingDB/SeasonsModel";

export default async function deleteSeason({
	params: { year },
	set,
}: Context<{ params: { year: number } }>) {
	try {
		const del = await Seasons.findOneAndDelete({ year });
		if (!del) {
			set.status = 404;
			return { message: "Season not found" };
		}
		set.status = 200;
		return { message: "Season deleted" };
	} catch (e) {
		await logError("Error deleting season: " + e);
		set.status = 500;
		return { message: "Internal server error deleting season" };
	}
}
