import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-pin.png";
import Modal from "./Modal";
import "../css/login.css";
const Login = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.google && window.google.accounts) {
      /* global google */
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
        callback: responseGoogle,
      });
    } else {
      console.error("Google no está definido");
    }

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "dark",
      scope: "profile email",
      size: "large",
      width: "200px",
      text: "continue_with",
      logo_alignment: "left",
      shape: "pill",
    });
    localStorage.clear();
  }, []);
  const responseGoogle = (response) => {
    const userObject = jwt_decode(response.credential);
    if (userObject.sub && userObject.picture) {
      userObject.googleId = userObject.sub;
      userObject.imageUrl = userObject.picture;
      delete userObject.sub;
      delete userObject.picture;
    }
    const { email, name, googleId, imageUrl } = userObject;
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
      email: email,
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doc),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("El inicio de sesión falló");
        }
        return response.json();
      })
      .then((response) => {
        if (response.status === "registered" || response.status === "updated") {
          localStorage.setItem("user", JSON.stringify(userObject));
          console.log("Usuario registrado");
          navigate("/", { replace: true });
        } else {
          setModalOpen(true);
          localStorage.clear();
          console.log("usuario no registrado");
        }
      })
      .catch((error) => {
        console.error(
          "Hubo un problema con la operación fetch: ",
          error.message
        );
      });
  };
  const onFailure = (err) => {
    console.error(err);
  };

  return (
    <div className="animatedBackground flex justify-center items-center  h-screen">
      <div
        className="shadow-2xl fade-in rounded w-4/5 max-w-lg p-4 bg-[#fefefe] 
      flex flex-col justify-center items-center"
      >
        <div className="p-5">
          <img src={logo} className="w-48 md:w-56 object-cover" alt="logo" />
        </div>
        <div className="flex flex-col items-center justify-between h-24 md:h-36 w-full">
          <p className="pb-2 text-sm md:text-base">Ingresa con Google!</p>
          <div className="flex justify-center pl-4">
            <div
              id="signInDiv"
              className="flex justify-self-end md:text-lg"
              data-onsuccess="onSignIn"
              data-onfailure={onFailure}
            ></div>
          </div>
          <p className="w-full text-[10px] text-right mt-4 pr-4">
            Desarrollado por Pedro Bozzeta
          </p>
        </div>
      </div>
      <Modal isOpen={isModalOpen} />
    </div>
  );
};

export default Login;
