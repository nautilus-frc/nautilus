import { Context } from "elysia";
import { Crescendos } from "../../../../../models/scoutingDB/games/crescendo/Crescendo";
import { logError } from "../../../../../util/general/logging";
import crescendoResponse from "../../util/format";
import mongoose from "mongoose";

export default async function deleteCrescendo({
	set,
	params: { id },
}: Context<{ params: { id: string } }>) {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			set.status = 400;
			return { message: "Invalid ID" };
		}
		const deleted = await Crescendos.findByIdAndDelete(id);
		if (!deleted) {
			set.status = 404;
			return { message: "Crescendo not found" };
		}
		set.status = 200;
		return { message: "Crescendo deleted" };
	} catch (e) {
		set.status = 500;
		await logError("Error deleting scouting form: " + e);
		return { message: "Internal server error deleting scouting form" };
	}
}
