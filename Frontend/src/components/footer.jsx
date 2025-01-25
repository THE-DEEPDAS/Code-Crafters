import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <div className='flex flex-row bg-gray-900 p-9 justify-between'>
            <p className='text-white'>Made with Love by Team Web_ ❤️, All rights reserved.</p>
            <Link
              to="/contact"
              className="text-white hover:text-blue-200 font-semibold"
            >Contact Us</Link>
        </div>
    );
};

export default Footer;