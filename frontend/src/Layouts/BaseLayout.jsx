import React from 'react';
import PropTypes from "prop-types";
import Navbar from "../components/navbar";

const BaseLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
	children: PropTypes.element,
};

export default BaseLayout;