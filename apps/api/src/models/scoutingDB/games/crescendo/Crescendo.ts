import mongoose, {
	HydratedDocumentFromSchema,
	InferSchemaType,
} from "mongoose";
import { scoutingDB } from "../../../../config/db";

const crescendoSchema = new mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "users",
		},
		competition: { type: String, required: true },
		teamNumber: { type: Number, required: true },
		teamName: { type: String, required: true },
		matchNumber: { type: Number, required: true },
		score: { type: Number, required: true },
		penaltyPointsEarned: { type: Number, required: true },
		won: { type: Boolean, required: true },
		tied: { type: Boolean, required: true },
		comments: { type: String, required: true, default: "" },
		defensive: { type: Boolean, required: true },
		brokeDown: { type: Boolean, required: true },
		rankingPoints: { type: Number, required: true },
		auto: {
			type: {
				leave: { type: Boolean, required: true },
				ampNotes: { type: Number, required: true },
				speakerNotes: { type: Number, required: true },
			},
			required: true,
		},
		teleop: {
			type: {
				ampNotes: { type: Number, required: true },
				speakerUnamped: { type: Number, required: true },
				speakerAmped: { type: Number, required: true },
			},
			required: true,
		},
		stage: {
			type: {
				state: { type: String, required: true },
				//"NOT_PARKED", "PARKED", "ONSTAGE", "ONSTAGE_SPOTLIT",
				harmony: { type: Number, required: true },
				trapNotes: { type: Number, required: true },
			},
			required: true,
		},
		ranking: {
			type: {
				melody: { type: Boolean, required: true },
				ensemble: { type: Boolean, required: true },
			},
			required: true,
		},
	},
	{
		timestamps: true,
		minimize: false,
		strict: true,
	}
);

export const Crescendos = scoutingDB.model("crescendos", crescendoSchema);

export type ICrescendo = InferSchemaType<typeof crescendoSchema>;

export type Crescendo = HydratedDocumentFromSchema<typeof crescendoSchema>;
