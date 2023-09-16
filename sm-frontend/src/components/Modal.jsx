import React from "react";
import { SiGmail } from "react-icons/si";
import { AiFillInstagram, AiFillGithub } from "react-icons/ai";
import { BiSolidArrowFromLeft } from "react-icons/bi";
import { Link } from "react-router-dom";
const Modal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="bg-[#f2f2f2] rounded-lg p-5 w-11/12 md:w-3/5 xl:w-1/3 jello-horizontal">
        <p className="text-center mb-5">
          Este proyecto es netamente demostrativo, por lo que la cantidad de
          usuarios registrados así como el tránsito de datos es limitado, puedes
          solicitar el registro de tu cuenta de gmail contactándome por estos
          medios
        </p>
        <div className="flex justify-around">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pedrobozzetareyes@gmail.com&subject=Registro%20en%20Pintagram."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-300 p-2 rounded-md"
          >
            <SiGmail className="text-xl" />
          </a>
          <a
            href="https://github.com/PedroBozzeta"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-300 p-2 rounded-md"
          >
            <AiFillGithub className="text-xl" />
          </a>
          <a
            href="https://www.instagram.com/pedrobozzetareyes/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-300 p-2 rounded-md"
          >
            <AiFillInstagram className="text-xl" />
          </a>
        </div>
        <div className="flex items-center text-center justify-center mt-5">
          <p className="mr-8">Aún así puedes puedes echarle un ojo!</p>
          <Link
            to="/"
            className="bg-marron text-white p-2 rounded-md shadow-2xl  bounce-left"
          >
            <BiSolidArrowFromLeft className="text-xl" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Modal;
