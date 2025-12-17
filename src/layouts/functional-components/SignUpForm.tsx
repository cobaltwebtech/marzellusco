import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

export interface FormData {
	firstName?: string;
	email: string;
	password: string;
}

const SignUpForm = () => {
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setLoading(true);
			const form = new FormData();
			form.append("firstName", formData.firstName || "");
			form.append("email", formData.email);
			form.append("password", formData.password);

			const response = await fetch("/api/sign-up", {
				method: "POST",
				body: form, // Use FormData
			});

			const contentType = response.headers.get("content-type");

			if (contentType && contentType.includes("application/json")) {
				const responseData = await response.json();

				if (response.ok) {
					setErrorMessages([]);
					localStorage.setItem("user", JSON.stringify(responseData));
					window.location.href = "/";
				} else {
					const errors = responseData.errors || [
						{ message: "Sign-up failed." },
					];
					setErrorMessages(errors.map((error: any) => error.message));
				}
			} else {
				setErrorMessages(["Invalid response from the server."]);
			}
		} catch (error) {
			console.error("Error during sign-up:", error);
			setErrorMessages(["An error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="section">
			<div className="container">
				<div>
					<div className="col-11 mx-auto sm:col-9 md:col-7">
						<div className="mb-14 text-center">
							<h2 className="max-md:h1 md:mb-2">Create an account</h2>
							<p className="md:text-lg">Create an account and start using...</p>
						</div>

						<form onSubmit={handleSignUp}>
							<div>
								<label className="form-label">Name</label>
								<input
									name="firstName"
									className="form-input"
									placeholder="Enter your name"
									type="text"
									onChange={handleChange}
									value={formData.firstName}
									required
								/>
							</div>

							<div>
								<label className="form-label mt-8">Email Address</label>
								<input
									name="email"
									className="form-input"
									placeholder="Type your email"
									type="email"
									onChange={handleChange}
									value={formData.email}
									required
								/>
							</div>

							<div>
								<label className="form-label mt-8">Password</label>
								<input
									name="password"
									className="form-input"
									placeholder="********"
									type="password"
									onChange={handleChange}
									value={formData.password}
									required
								/>
							</div>

							{errorMessages.length > 0 &&
								errorMessages.map((error, index) => (
									<p key={index} className="mt-2 font-medium text-red-500">
										*{error}
									</p>
								))}

							<button
								type="submit"
								className="btn btn-primary mt-10 w-full md:text-lg md:font-medium"
							>
								{loading ? (
									<BiLoaderAlt className="mx-auto animate-spin" size={26} />
								) : (
									"Sign Up"
								)}
							</button>
						</form>

						<div className="mt-6 flex gap-x-2 text-sm md:text-base">
							<p className="text-light dark:text-darkmode-light">
								I have read and agree to the
							</p>
							<a
								className="text-dark dark:text-darkmode-dark font-medium underline"
								href="/terms-services"
							>
								Terms & Conditions
							</a>
						</div>

						<div className="mt-2 flex gap-x-2 text-sm md:text-base">
							<p className="text-light dark:text-darkmode-light">
								Have an account?
							</p>
							<a
								className="text-dark dark:text-darkmode-dark font-medium underline"
								href="/login"
							>
								Login
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignUpForm;
