import { Elysia } from "elysia";
import { Render } from "./render";
import { PasswordResetEmail } from "./resetemail";

export const htmlPreview =
	process.env.NODE_ENV === "production"
		? new Elysia()
		: new Elysia().get("/preview", () =>
				Render(<PasswordResetEmail otp="meow1" host="localhost:1234" />)
			);
