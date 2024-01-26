import mongoose from "mongoose";

export interface Permissions {
			generalScouting: boolean;
			pitScouting: boolean;
			viewScoutingData: boolean;
			blogPosts: boolean;
			makeMeetings: boolean;
			viewMeetings: boolean;
			deleteMeetings: boolean;
			makeAnnouncements: boolean;
		};

export const userPermissionsSchema = new mongoose.Schema<Permissions>({
            generalScouting: Boolean,
            pitScouting: Boolean,
            viewScoutingData: Boolean,
            blogPosts: Boolean,
            makeMeetings: Boolean,
            viewMeetings: Boolean, 
            deleteMeetings: Boolean,
            makeAnnouncements: Boolean,
        });

export const userRoleSchema = new mongoose.Schema(
    {
        role: { type: String, required: true, trim: true },
        permissions: userPermissionsSchema
    },
    {
        timestamps: true,
    }
);

