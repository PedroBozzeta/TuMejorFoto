import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { categories } from "../clientFront.js";

import Spinner from "./Spinner";
const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState();
  const [validUrl, setValidUrl] = useState(true);
  const [category, setCategory] = useState([]);
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    validateURL();
  }, [destination]);

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Image upload error", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const addHttpsIfMissing = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  const validateURL = () => {
    const updatedDestination = addHttpsIfMissing(destination);
    if (updatedDestination !== destination) {
      setDestination(updatedDestination);
    }

    const regex = /^(https?:\/\/)?(www\.)?[\w-]+\.\w{2,}([\w-./?=&#%]*)?$/i;
    setValidUrl(regex.test(updatedDestination));
  };

  const savePin = () => {
    if (title && about && validUrl && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };
      fetch(`${process.env.REACT_APP_BACKEND_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doc),
      })
        .then(navigate("/"))
        .catch((err) => console.error(err));
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 3000);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-lg transition-all duration-150 ease-in">
          Por favor llena todos los campos
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondary p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Archivo de tipo incompatible.</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col bg-gray-300 justify-center items-center border-4 p-4 rounded-lg border-gray-600 border-dotted cursor-pointer">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click para subir archivo</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Los formatos de imagen compatible son JPG,DVG,PNG,GIF, con
                    tamaño menor a 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ponle un título a esta obra!"
            className="outline-none text-xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Cuéntanos acerca de tu imagen"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {!validUrl && fields && (
            <p className="text-base sm:text-sm text-red-500">
              Por favor ingresa una dirección válida
            </p>
          )}
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ejemplo: www.instagram.com/micuentabienfachera"
            className="outline-none text-base border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <p className="mb-2 font-semibold text-lg sm:text-xl">
              Selecciona una categoría para tu imagen
            </p>
            <select
              name=""
              id=""
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 capitalize rounded-md cursor-pointer"
            >
              <option className="bg-white" value="other">
                Selecciona una categoría
              </option>
              {categories?.map((cate, i) => (
                <option
                  key={i}
                  value={cate.name}
                  className="text-base border-0 outline-none capitalize bg-white text-black"
                >
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end items-end m-5">
            <button
              type="button"
              onClick={savePin}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
