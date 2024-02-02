export const Form = () => (
	<form
		hx-post="/pages/reset"
		hx-swap="outerHTML"
		hx-target=".target"
		class="items-around flex flex-col w-full"
	>
		<Input label="Email" name="email" type="email" />
		<Input label="New Password" name="newPassword" type="password" />
		<Input
			label="Confirm New Password"
			name="confirmNewPassword"
			type="password"
		/>
		<Input label="Reset Code" name="otp" type="text" />
		<div class="w-full flex flex-row justify-center">
			<button
				class="bg-red-800 rounded-lg py-2 text-white w-fit px-8 text-xl"
				type="submit"
			>
				Reset
			</button>
		</div>
	</form>
);

function Input({
	name,
	label,
	type,
}: {
	name: string;
	label: string;
	type: string;
}) {
	const togglePasswordVisibilityScript = `document.getElementById('${name}').type = document.getElementById('${name}').type === 'password' ? 'text' : 'password'; this.innerHTML = document.getElementById('${name}').type === 'password' ? 'visibility_off' : 'visibility';`;
	return (
		<>
			<label for={name} class="text-xl m-2 font-semibold" safe>
				{label}
			</label>
			<div class="relative">
				<input
					type={type}
					name={name}
					id={name}
					required
					placeholder={label}
					class="bg-zinc-600 rounded-md p-4 text-white border-2 border-gray-900 w-full"
				/>
				{type === "password" ? (
					<span
						class="material-symbols-outlined absolute top-1/2 right-0 -translate-x-4 -translate-y-1/2"
						hx-on:click={togglePasswordVisibilityScript}
					>
						visibility_off
					</span>
				) : null}
			</div>
			<br />
		</>
	);
}
