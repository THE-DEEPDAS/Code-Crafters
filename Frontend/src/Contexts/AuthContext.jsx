import  { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || "");
    // eslint-disable-next-line no-unused-vars
    const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				// Decode the token payload to get user data
				const payload = JSON.parse(atob(token.split(".")[1]));
				setUser(payload); // Set user details
				setIsLoggedIn(true);
			} catch (err) {
				console.error("Invalid token", err);
				setIsLoggedIn(false);
			}
		} else {
			setIsLoggedIn(false);
		}
	}, []);

	const login = (newToken) => {
		setToken(newToken);
        setIsLoggedIn(true);
        console.log("ok", isLoggedIn)
		localStorage.setItem("token", newToken);
	};

	const logout = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
};
AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
