import { Context } from "elysia";
import { handleForgot } from "../../routes/users/handlers/forgot";
import ErrorPage from "../reset/components/error";

export default async function forgotHandler({
	body,
	headers,
}: Context<{ body: { email: string } }>) {
	const { email } = body;
	const host = process.env.HOST ?? "";
	const { ok, text, code } = await handleForgot(email, host);

	if (!ok) return <ErrorPage message={text} />;
	return (
		<h2
			hx-on-htmx-load="htmx.remove('form')"
			class="text-3xl font-bold text-green-600"
			safe
		>
			{text}
		</h2>
	);
}
