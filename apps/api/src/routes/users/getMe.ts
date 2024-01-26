import { User } from "../../models/usersDB/UserModel";
import json from "../../util/json";
import { ProtectedContext, generateToken } from "../../util/protect";

export async function getMe({ user, set, path }: ProtectedContext) {
	try {
		set.status = 200;
		await User.create({ meow: "meow" });
		return json({
			...user.toObject(),
			password: undefined,
			token: generateToken(user._id.toString()),
		});
	} catch (e) {
		set.status = 500;
		console.error(`Error at ${path}: ${e}`);
		return json({ message: "Internal server error: " + e });
	}
}
