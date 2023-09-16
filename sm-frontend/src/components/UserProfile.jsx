import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-3 rounded-full w-24 outline-none";
const notActiveBtnStyles =
  "bg-primary text-black font-bold p-3 rounded-full w-24 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState("Publicado");
  const [activeBtn, setActiveBtn] = useState("created");
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener el usuario");
        }
        return response.json();
      })
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, [userId]);

  useEffect(() => {
    if (text === "Publicado") {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/posts?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setPins(data);
        })
        .catch((error) => {
          console.error("Error fetching pins:", error);
        });
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/saved?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setPins(data);
        })
        .catch((error) => {
          console.error("Error fetching pins:", error);
        });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <Spinner message="Cargando Perfil" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-56 2xl:h-96 object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className=" border-sm 2xl:h-32 2xl:w-32 rounded-md w-20 h-20 -mt-10 2xl:-mt-16 border-4 border-white object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User?.googleId && (
              <button
                type="button"
                onClick={() => logout()}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className=" flex transition ease-in-out duration-100 bg-white justify-around p-2 rounded-full cursor-pointer outline-none shadow-md"
              >
                {hovered && <p className="px-1">Salir</p>}
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Publicado
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Guardado
          </button>
        </div>

        <div className="px-2">
          <MasonryLayout pins={pins} />
        </div>

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            Sin imágenes encontradas!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
