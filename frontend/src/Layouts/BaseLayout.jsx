import React from 'react';
import PropTypes from "prop-types";
import Navbar from "../components/navbar";
import Footer from '../components/footer';

const BaseLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#00cc8c]">
      <Navbar />
      {children}
      <Footer/>
    </div>
  );
};

BaseLayout.propTypes = {
	children: PropTypes.element,
};

export default BaseLayout;