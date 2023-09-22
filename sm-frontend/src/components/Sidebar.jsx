import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { categories } from "../clientFront.js";
import logo from "../assets/logo-pin.png";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out-capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out-capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-48 max-w-54 hide-scrollbar">
      <div className="flex flex-col justify-start">
        <Link to="/" className="flex p-5 w-72">
          <img
            onClick={handleCloseSidebar}
            src={logo}
            alt="logo"
            className="w-3/5 object-cover lg:w-4/5"
          />
        </Link>
        <div className="flex flex-col gap-4 md:gap-5 -mt-2">
          <NavLink
            to="/"
            onClick={handleCloseSidebar}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            <RiHomeFill />
            Inicio
          </NavLink>
          {categories?.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
              style={{ textTransform: "capitalize" }}
            >
              <img
                src={category.image}
                className=" w-6 h-6 md:w-8 md:h-8 rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`/user-profile/${user._id}`}
          className="flex gap-2 my-2 p-2 transition duration-200 ease-in-out hover:text-white items-center hover:bg-[#5f483c] rounded-lg shadow-2xl mx-3"
          onClick={handleCloseSidebar}
        >
          <img
            src={user.image}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
            alt="user-profile"
          />
          <p className="hover:text-white text-sm">{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
