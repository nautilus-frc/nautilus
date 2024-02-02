import mongoose, { InferSchemaType } from "mongoose";

export const userPermissionsSchema = new mongoose.Schema({
	generalScouting: { type: Boolean, required: true, default: false },
	pitScouting: { type: Boolean, required: true, default: false },
	viewScoutingData: { type: Boolean, required: true, default: false },
	blogPosts: { type: Boolean, required: true, default: false },
	makeMeetings: { type: Boolean, required: true, default: false },
	viewMeetings: { type: Boolean, required: true, default: false },
	deleteMeetings: { type: Boolean, required: true, default: false },
	makeAnnouncements: { type: Boolean, required: true, default: false },
});

export type Permissions = InferSchemaType<typeof userPermissionsSchema>;

export const userRoleSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		permissions: { type: userPermissionsSchema, required: true },
	},
	{
		timestamps: true,
	}
);
