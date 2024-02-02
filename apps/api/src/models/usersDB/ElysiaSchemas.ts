import { t } from "elysia";
import { Permissions } from "./UserRoleModel";
import {
	limitedUserResponse,
	userResponseNoToken,
	userResponseToken,
} from "../../util/userUtil";

export const TUserPermissions = t.Object({
	generalScouting: t.Boolean(),
	pitScouting: t.Boolean(),
	viewMeetings: t.Boolean(),
	viewScoutingData: t.Boolean(),
	blogPosts: t.Boolean(),
	deleteMeetings: t.Boolean(),
	makeAnnouncements: t.Boolean(),
	makeMeetings: t.Boolean(),
} satisfies TPermissions);

export const TUserAttendance = t.Record(
	t.String(),
	t.Object({
		totalHoursLogged: t.Numeric(),
		logs: t.Array(
			t.Object({
				meetingId: t.String(),
				verifiedBy: t.String(),
			})
		),
	})
);

export const TUser = t.Object({
	_id: t.String(),
	firstname: t.String(),
	lastname: t.String(),
	username: t.String(),
	email: t.String(),
	subteam: t.Optional(t.String()),
	roles: t.Array(t.String()),
	accountType: t.Number(),
	token: t.String(),
	accountUpdateVersion: t.Number(),
	attendance: TUserAttendance,
	grade: t.Optional(t.Numeric()),
	permissions: TUserPermissions,
	phone: t.Optional(t.String()),
} satisfies Record<keyof ReturnType<typeof userResponseToken>, unknown>);

export const TUserNoToken = t.Object({
	_id: t.String(),
	firstname: t.String(),
	lastname: t.String(),
	username: t.String(),
	email: t.String(),
	subteam: t.Optional(t.String()),
	roles: t.Array(t.String()),
	accountType: t.Number(),
	accountUpdateVersion: t.Number(),
	attendance: TUserAttendance,
	grade: t.Optional(t.Numeric()),
	permissions: TUserPermissions,
	phone: t.Optional(t.String()),
} satisfies Record<keyof ReturnType<typeof userResponseNoToken>, unknown>);

export const TLimitedUser = t.Object({
	"_id": t.String(),
	"firstname": t.String(),
	"lastname": t.String(),
	"username": t.String(),
	"email": t.String(),
	"subteam": t.Optional(t.String()),
	"roles": t.Array(t.String()),
	"accountType": t.Number(),
} satisfies Record<keyof ReturnType<typeof limitedUserResponse>, unknown>);

type TPermissions = Record<keyof Permissions, ReturnType<typeof t.Boolean>>;
