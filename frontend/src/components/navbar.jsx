import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="bg-[#8Ed081] p-4 ">
      <div className="container mx-auto">
        <ul className="flex flex-row gap-4">
          <li>
            <Link to="/" className="text-white hover:text-blue-200 font-bold">
              Home
            </Link>
          </li>
          <li>
            <Link to="/insights" className="text-white hover:text-blue-200 font-bold">
              Insights
            </Link>
          </li>
          <li>
            <a href="https://cup-karma-insights.streamlit.app" rel="noopener noreferrer" className="text-white hover:text-blue-200 font-bold">
              Recommendations
            </a>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:text-blue-200 font-bold">  
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

