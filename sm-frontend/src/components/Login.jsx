import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
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
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error(
          "Hubo un problema con la operación fetch: ",
          error.message
        );
      });
  };
  // setGoogleLogin(){

  // }
  // useEffect(() => {
  //   const start = () => {
  //     gapi.auth2.getAuthInstance({
  //       clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
  //     });
  //   };
  //   gapi.load("client:auth2", start);
  // }, []);
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId="625153889087-l2h9q50udr516pa9k7bsstl0s9as4otb.apps.googleusercontent.com"
              render={(renderProps) => (
                <button
                  disabled={renderProps.disabled}
                  onClick={renderProps.onClick}
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                >
                  <FcGoogle className="mr-4" />
                  Ingresa con tu cuenta de Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
            <div className="g-signin2" data-onsuccess="onSignIn"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
