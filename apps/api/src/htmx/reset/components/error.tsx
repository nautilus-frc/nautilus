export default function ErrorPage({ message }: { message: string }) {
	return (
		<h2 safe class="text-2xl text-red-600 font-bold target">
			{message}
		</h2>
	);
}
