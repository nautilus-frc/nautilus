export default function ResetPasswordSuccessPage() {
	return (
		<h2
			hx-on-htmx-load="htmx.remove('form')"
			class="text-3xl font-bold text-green-600"
		>
			Your password has been successfully reset. Please store your new
			password somewhere safe and do not lose it.
		</h2>
	);
}
