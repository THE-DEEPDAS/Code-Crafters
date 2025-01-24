import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Insights from "./Pages/insights";
import ContactPage from "./Pages/ContactPage";
import Signin from "./Pages/signin";

import Signup from "./Pages/signup";
export default function App() {
	return (
		<div>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/insights' element={<Insights />} />
				<Route path='/contact' element={<ContactPage />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/signin' element={<Signin />} />
			</Routes>
		</div>
	);
}
