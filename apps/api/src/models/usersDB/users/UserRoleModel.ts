import mongoose, {
	HydratedDocumentFromSchema,
	InferSchemaType,
} from "mongoose";
import { usersDB } from "../../../config/db";

export const userPermissionsSchema = new mongoose.Schema(
	{
		generalScouting: { type: Boolean, required: true, default: false },
		pitScouting: { type: Boolean, required: true, default: false },
		viewScoutingData: { type: Boolean, required: true, default: false },
		blogPosts: { type: Boolean, required: true, default: false },
		makeMeetings: { type: Boolean, required: true, default: false },
		viewMeetings: { type: Boolean, required: true, default: false },
		deleteMeetings: { type: Boolean, required: true, default: false },
		makeAnnouncements: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: false,
		_id: false,
	}
);

export type Permissions = InferSchemaType<typeof userPermissionsSchema>;

export const userRoleSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		permissions: { type: userPermissionsSchema, required: true },
	},
	{
		timestamps: false,
		_id: true,
	}
);

export const UserRoles = usersDB.model("roles", userRoleSchema);

export type IRole = InferSchemaType<typeof userRoleSchema>;

export type Role = HydratedDocumentFromSchema<typeof userRoleSchema>;
