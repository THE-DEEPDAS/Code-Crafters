import { Link } from "react-router-dom"


const Navbar = () => {
  return (
		<nav className='bg-[#8Ed081] p-4 '>
			<div className='grid grid-cols-2 container mx-auto'>
				<ul className='flex flex-row gap-4'>
					<li>
						<Link to='/' className='text-white hover:text-blue-200 font-bold'>
							Home
						</Link>
					</li>
					<li>
						<Link
							to='/insights'
							className='text-white hover:text-blue-200 font-bold'
						>
							Insights
						</Link>
					</li>
					<li>
						<a
							href='https://cup-karma-insights.streamlit.app'
							rel='noopener noreferrer'
							className='text-white hover:text-blue-200 font-bold'
						>
							Recommendations
						</a>
					</li>
					<li>
						<Link
							to='/contact'
							className='text-white hover:text-blue-200 font-bold'
						>
							Contact
						</Link>
					</li>
				</ul>
				<ul className='flex flex-row-reverse '>
					<li>
						<Link
							to='/signin'
							className='text-white hover:text-blue-200 pr-4 font-bold'
						>
							Sign In
						</Link>
						<Link
							to='/signup'
							className='text-white hover:text-blue-200 pr-4  font-bold'
						>
							Sign Up
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar

