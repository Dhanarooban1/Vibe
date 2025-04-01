import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/" className="text-white text-xl font-bold">
              Parking System
            </Link>
          </div>
          <div className="flex space-x-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-white hover:text-blue-200">
                  Book Parking
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-white hover:text-blue-200">
                  View Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
          <button 
            onClick={onLogout} 
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
          >
            Logout
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;