import mongoose, {
	HydratedDocumentFromSchema,
	InferSchemaType,
} from "mongoose";
import { scoutingDB } from "../../config/db";

const seasonSchema = new mongoose.Schema(
	{
		year: { type: Number, required: true, unique: true },
		name: { type: String, required: true }, //name of the game, e.g. ChargedUp or Crescendo
		competitions: { type: [String], required: true, default: [] },
		attendancePeriods: { type: [String], required: true, default: [] },
		//ex 2023spring or 2024fall, determines list of available attendancePeriods on meeting creation screen in app for attendance
		//serve as keys for user attendance object
	},
	{
		timestamps: true,
		minimize: false,
		strict: true,
	}
);

export const Seasons = scoutingDB.model("seasons", seasonSchema);

export type ISeason = InferSchemaType<typeof seasonSchema>;

export type Season = HydratedDocumentFromSchema<typeof seasonSchema>;
