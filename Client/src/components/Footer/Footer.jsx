import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="w-full px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-300 text-sm">
              © 2024 Whitney's Creations. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/attributions"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              Icon Attributions
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              About
            </Link>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600 text-center">
          <p className="text-gray-400 text-xs">
            Professional icons from The Noun Project • Used under CC BY 3.0 license
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;