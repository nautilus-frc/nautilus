import mongoose from "mongoose";

const MONGO_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGO_URI_PROD
		: process.env.MONGO_URI_DEV;

const connectDB = (dbUrl: string) => {
	try {
		return mongoose.createConnection(dbUrl);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

const connAppend =
	process.env.NODE_ENV === "production"
		? "?retryWrites=true&w=majority&directConnection=true&authSource=admin"
		: "?retryWrites=true&w=majority";

const usersDB = connectDB(MONGO_URI + "users" + connAppend);

const scoutingDB = connectDB(MONGO_URI + "scouting" + connAppend);

export { usersDB, scoutingDB };
