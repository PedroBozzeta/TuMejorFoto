import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full p-2 justify-center items-center">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within shadow-small">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3 px-2">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user?.image}
            className="w-14 h-12 rounded-lg"
            alt={`${user?.name}`}
          />
        </Link>
        <Link
          to={`create-pin`}
          className="bg-[#5f483c] text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center"
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
