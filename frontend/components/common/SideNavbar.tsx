"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex items-center p-4 bg-white text-black">
        <button onClick={toggleNavbar} className="focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 w-[50%] h-full text-center bg-[#f4f6fc] text-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center p-4 bg-[#f4f6fc] text-black flex justify-end">
          <button onClick={toggleNavbar} className="focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <nav className="flex flex-col p-6">
          <a href="#" className="mb-4 text-lg hover:text-gray-300">
            Home
          </a>
          <a href="#" className="mb-4 text-lg hover:text-gray-300">
            Sheets
          </a>
          <a href="#" className="mb-4 text-lg hover:text-gray-300">
            Contact
          </a>
          <a href="#" className="mb-4 text-lg hover:text-gray-300">
            Login
          </a>
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
