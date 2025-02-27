/** @type {import('tailwindcss').Config} */
import autoprefixer from "autoprefixer";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	
	plugins: [autoprefixer],
};
