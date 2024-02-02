import HtmxBase from "../HtmxBase";
import { Form } from "./components/form";

export default function ResetPasswordPage() {
	return (
		<HtmxBase title="Reset Password">
			<body class="bg-black xl:p-24 lg:p-16 p-6 text-white flex flex-col items-center">
				<main class="bg-gray-800 lg:px-16 px-8 py-16 rounded-md flex-1 min-w-[50%] flex flex-col">
					<h1 class="mb-4 text-4xl font-bold w-full text-center">
						Reset Password
					</h1>
					<div class="hidden target"></div>
					<Form />
				</main>
			</body>
		</HtmxBase>
	);
}
