import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserIcon } from "lucide-react"; // Import UserIcon from lucid-react

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-[#8Ed081] p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src=".\src\assets\ecobrew.png"
            alt="Eco Brew Logo"
            className="h-12 w-12 mr-4"
          />
          <h1 className="text-white font-bold text-xl">EcoBrew</h1>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6">
          <li>
            <Link
              to="/"
              className="text-white hover:text-blue-200 font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/encourage"
              className="text-white hover:text-blue-200 font-semibold"
            >
              Encourage
            </Link>
          </li>
          <li>
            <a
              href="http://localhost:8501"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 font-semibold"
            >
              Recommendations
            </a>
          </li>
          <li>
            <Link
              to="/insights"
              className="text-white hover:text-blue-200 font-semibold"
            >
              Insights
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-white hover:text-blue-200 font-semibold"
            >
              Contact
            </Link>
          </li>
          {user ? (
            <li>
              <Link to="/encourage" className="text-white font-semibold flex items-center gap-2">
                <UserIcon /> {user.username} {/* Use UserIcon from lucid-react */}
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/signup"
                  className="bg-white text-[#8Ed081] hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/signin"
                  className="bg-white text-[#8Ed081] hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
