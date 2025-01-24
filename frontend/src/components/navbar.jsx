import React from "react"
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
            <Link to="/purpose" className="text-white hover:text-blue-200 font-bold">
              Purpose
            </Link>
          </li>
          <li>
            <Link to="/recommendations" className="text-white hover:text-blue-200 font-bold">
              Recommendations
            </Link>
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

