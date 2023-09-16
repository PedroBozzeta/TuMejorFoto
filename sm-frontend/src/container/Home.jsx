import React, { useState, useEffect, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import { Sidebar, UserProfile } from "../components";
import logo from "../assets/logo-white.png";
import Pins from "./Pins";
import { fetchUser } from "../clientFront";
const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const isMounted = useRef(true);
  const userInfo = fetchUser();

  useEffect(() => {
    isMounted.current = true;
    if (userInfo?.googleId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userInfo?.googleId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el usuario");
          } else {
          }
          return response.json();
        })
        .then((user) => {
          if (isMounted.current) {
            setUser(user);
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-48" />
          </Link>
          {user ? (
            <Link to={`user-profile/${user?._id}`}>
              <img src={user?.image} alt="logo" className="w-12 rounded-full" />
            </Link>
          ) : (
            <Link
              to={`/login`}
              className="flex my-5 mb-3 gap-2 p-2 transition duration-200 ease-in-out text-white items-center bg-[#5f483c] rounded-lg shadow-2xl mx-3"
            >
              <p className="hover:text-white">Ingresar</p>
            </Link>
          )}
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        {!user && (
          <div className="p-2 w-full flex flex-row-reverse justify-between items-center">
            <Link
              to={`/login`}
              className=" hidden md:flex my-5 mb-3 gap-2 p-2 transition duration-200 ease-in-out text-white items-center bg-[#5f483c] rounded-lg shadow-2xl mx-3"
            >
              <p className="hover:text-white">Ingresar</p>
            </Link>{" "}
          </div>
        )}
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
