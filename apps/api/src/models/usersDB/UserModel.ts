import mongoose, { HydratedDocumentFromSchema } from "mongoose";
import { usersDB } from "../../config/db";
import { Permissions, userRoleSchema } from "./UserRoleModel";

export interface IUser {
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	password: string;
	phone: string;
	subteam?: string; //"software" | "build" | "executive" | "marketing" | "electrical" | "design"
	grade?: number;
	roles: {
		name: string;
		permissions: Permissions;
	}[];
	accountType: number;
	accountUpdateVersion: number;
	forgotPassword?: {
		code: string;
		expiresAt: number;
	};
	rateLimit?: {
		count: number;
		expiresAt: number;
	};
	attendance: {
		[key: string]: {
			totalHoursLogged: number;
			logs: {
				meetingId: string;
				verifiedBy: string;
			}[];
		};
	};
}

const userSchema = new mongoose.Schema<IUser>(
	{
		firstname: { type: String, required: true, trim: true },
		lastname: { type: String, required: true, trim: true },
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		phone: { type: String, required: true, unique: true },
		subteam: { type: String, required: false }, //"software" | "build" | "executive" | "marketing" | "electrical" | "design"
		grade: { type: Number, required: false },
		roles: { type: [userRoleSchema], required: true },
		accountType: { type: Number, required: true, default: 0 },
		accountUpdateVersion: { type: Number, required: true, default: 1 },
		forgotPassword: {
			type: {
				code: { type: String },
				expiresAt: { type: Number },
			},
			required: false,
		},
		// forgotPassword: {
		// code: { type: String },
		// expiresAt: { type: Number },
		// },
		rateLimit: {
			type: {
				count: { type: Number },
				expiresAt: { type: Number },
			},
			required: false,
		},
		// rateLimit: {
		// count: Number,
		// expiresAt: Number,
		// },

		attendance: {
			type: Object,
			required: true,
			default: {},
		},
		//map of string to attendance object
	},
	{
		timestamps: true,
		minimize: false,
	}
);

export type User = HydratedDocumentFromSchema<typeof userSchema>;

export const Users = usersDB.model("users", userSchema);

/**
 * {
 *  permission 1: Boolean,
 *  permission 2: Boolean,
 *  roles: [role 1, role 2, role 3]
 * }
 */
