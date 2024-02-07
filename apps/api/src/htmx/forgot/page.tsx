export default function ForgotPasswordPage() {
	return (
		<body class="bg-black xl:p-24 lg:p-16 p-6 text-white flex flex-col items-center">
			<main class="bg-gray-800 lg:px-16 px-8 py-16 rounded-md flex-1 min-w-[50%] flex flex-col">
				<h1 class="mb-4 text-4xl font-bold w-full text-center">
					Forgot Password
				</h1>
				<h2 class="my-4 text-2xl font-semibold">
					Enter your email address below and we will send you a link
					to reset your password.
				</h2>
				<div class="target hidden"></div>
				<form
					class="items-around flex flex-col w-full"
					hx-swap="outerHTML"
					hx-target=".target"
					hx-post="/pages/forgot"
				>
					<label for="email" class="text-xl m-2 font-semibold">
						Email
					</label>
					<input
						type="email"
						name="email"
						class="bg-zinc-600 rounded-md p-4 text-white border-2 border-gray-900 w-full"
						placeholder="Email"
					/>
					<br />
					<button
						type="submit"
						class="bg-blue-900 rounded-lg py-2 text-white w-fit px-8 text-xl"
					>
						Submit
					</button>
				</form>
			</main>
		</body>
	);
}
