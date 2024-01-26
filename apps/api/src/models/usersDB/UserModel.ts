import mongoose, {
	Document,
	HydratedDocumentFromSchema,
	InferSchemaType,
	Model,
} from "mongoose";
import { userRoleSchema } from "./UserRoleModel";
import { usersDB } from "../../config/db";

// export interface User  {
// 	firstname: string;
// 	lastname: string;
// 	username: string;
// 	email: string;
// 	password: string;
// 	phone?: string;
// 	subteam?: string; //"software" | "build" | "executive" | "marketing" | "electrical" | "design"
// 	grade?: number;
// 	roles: {
// 		role: string;
// 		permissions: Permissions;
// 	}[];
// 	accountType: number;
// 	accountUpdateVersion: number;
// 	forgotPassword?: {
// 		code: string;
// 		expiresAt: number;
// 	};
// 	rateLimit?: {
// 		count: number;
// 		expiresAt: number;
// 	};
// 	attendance: {
// 		[key: string]: {
// 			totalHoursLogged: number;
// 			logs: {
// 				meetingId: string;
// 				verifiedBy: string;
// 			}[];
// 		};
// 	};
// };

const userSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: true, trim: true },
		lastname: { type: String, required: true, trim: true },
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		phone: { type: String, required: false, unique: true },
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
			type: Map,
			of: {
				totalHoursLogged: { type: Number, required: true, default: 0 },
				logs: {
					type: [
						{
							meetingId: { type: String, required: true },
							verifiedBy: { type: String, required: true }, //userId of user who wrote the NFC tag
						},
					],
					required: true,
					default: [],
				},
			},
			required: true,
			default: {
				"2023spring": {
					totalHoursLogged: 0,
					logs: [],
				},
			},
		}, //map of string to attendance object
	},
	{
		timestamps: true,
	}
);

export type User = HydratedDocumentFromSchema<typeof userSchema>;

export const User = usersDB.model("users", userSchema);

/**
 * {
 *  permission 1: Boolean,
 *  permission 2: Boolean,
 *  roles: [role 1, role 2, role 3]
 * }
 */
