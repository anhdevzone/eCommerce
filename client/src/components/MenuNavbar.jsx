import React from "react";
import { NavLink } from "react-router-dom";

const MenuNavbar = () => {
  return (
    <div>
      <ul className="flex items-center justify-center gap-6 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-base font-medium text-primary"
              : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300 ease-in-out"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-base font-medium text-primary"
              : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300 ease-in-out"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/product"
          className={({ isActive }) =>
            isActive
              ? "text-base font-medium text-primary"
              : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300 ease-in-out"
          }
        >
          Shop
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            isActive
              ? "text-base font-medium text-primary"
              : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300 ease-in-out"
          }
        >
          Blog
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-base font-medium text-primary"
              : "text-base text-gray-700 font-medium hover:text-primary transition-all duration-300 ease-in-out"
          }
        >
          Contact
        </NavLink>
      </ul>
    </div>
  );
};

export default MenuNavbar;
