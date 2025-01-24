// React Component for the Sign In form
import { useState } from "react";
import BaseLayout from "../Layouts/BaseLayout";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const data = await response.json();
				alert("Sign in successful!");
				console.log("User data:", data);
			} else {
				alert("Invalid username or password");
			}
		} catch (error) {
			console.error("Error during sign-in:", error);
		}
	};

	return (
		<BaseLayout>
			<div className='flex items-center justify-center min-h-screen'>
				<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96'>
					<h1 className='text-2xl font-bold mb-4 text-gray-800'>Sign In</h1>
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label
								htmlFor='username'
								className='block text-gray-700 text-sm font-bold mb-2'
							>
								Username:
							</label>
							<input
								type='text'
								id='username'
								name='username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								required
							/>
						</div>
						<div className='mb-6'>
							<label
								htmlFor='password'
								className='block text-gray-700 text-sm font-bold mb-2'
							>
								Password:
							</label>
							<input
								type='password'
								id='password'
								name='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								required
							/>
						</div>
						<div className='flex items-center justify-between'>
							<button
								type='submit'
								className='bg-emerald-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							>
								Sign In
							</button>
						</div>
					</form>
				</div>
			</div>
		</BaseLayout>
	);
}
