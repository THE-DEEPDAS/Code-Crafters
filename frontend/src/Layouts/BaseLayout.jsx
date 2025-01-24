import PropTypes from "prop-types";
import Navbar from "../components/navbar";
export default function BaseLayout({ children }) {
	return (
		<div className='bg-[#394032] max-h-fit min-h-screen top-0 absolute w-full'>
			<Navbar />
			{children}
		</div>
	);
}


BaseLayout.propTypes = {
	children: PropTypes.element,
};