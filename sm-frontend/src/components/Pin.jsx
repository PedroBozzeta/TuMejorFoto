import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { fetchUser, getUrlFunction } from "../clientFront";
import Circle from "./Circle";

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [isMediumDevice, setIsMediumDevice] = useState(
    window.innerWidth <= 768
  );
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState("");
  const [isImageLoad, setIsImageLoad] = useState(true);
  const [visibleButtons, setVisibleButtons] = useState(false);
  const navigate = useNavigate();

  const { postedBy, image, _id, destination } = pin;

  const userInfo = fetchUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMediumDevice(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (isMediumDevice || postHovered) {
      setVisibleButtons(true);
    } else {
      setVisibleButtons(false);
    }
  }, [isMediumDevice, postHovered]);
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await getUrlFunction(_id);
      if (isMounted) {
        setUrl(data.imageUrl);
      }
    };

    fetchData();

    const isSaved = pin?.save?.some(
      (item) => item?.postedBy?._id === userInfo?.googleId
    );

    if (isMounted) {
      setSaved(isSaved);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isImageLoad) {
      setVisible("none");
    } else {
      setVisible("block");
    }
  }, [isImageLoad]);

  const checkIfSaved = () => {
    if (!saved && userInfo.googleId && postedBy._id !== userInfo.googleId) {
      setSaved(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          pinId: _id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isSaved) {
            console.log("El pin ya había sido guardado por este usuario");
          } else {
            if (data.nowSaved) {
              console.log("El pin ha sido guardado por este usuario");
            } else {
              console.log("El pin NO ha sido guardado por este usuario");
            }
          }
        })
        .catch((error) => {
          console.error("Error al verificar el pin:", error);
        });
    }
  };
  const unsavePin = () => {
    setSaved(false);
    if (saved && userInfo.googleId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/unlike`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo.googleId,
          pinId: _id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.removed) {
            console.log("El pin ha sido quitado de los guardados");
          }
        })
        .catch((error) => {
          console.error("Error al quitar el pin de los guardados:", error);
        });
    }
  };
  const deletePin = () => {
    if (userInfo?.googleId === postedBy._id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/pin/${_id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            console.log(data.message);
          }
          if (data.error) {
            console.error(data.error);
          }
        })
        .catch((error) => {
          console.error("Error al borrar el pin:", error);
        });
    }
  };
  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        {isImageLoad && (
          <div className={`rounded-lg py-10 w-full bg-gray-300`}>
            <Circle
              height={100}
              width={100}
              color="#4444ff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}
        <img
          style={{ display: visible }}
          className={`rounded-lg w-full`}
          alt="user-post"
          src={url}
          onLoad={() => setIsImageLoad(false)}
        />
        {visibleButtons && (
          <div
            style={{ height: "100%" }}
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 z-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image.asset.url}?width=250?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MdDownloadForOffline className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none" />
                </a>
              </div>
              {postedBy._id !== userInfo?.googleId && userInfo?.googleId && (
                <>
                  {saved ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unsavePin();
                      }}
                      type="button"
                      className="bg-white opacity-70 hover:opacity-100 text-red-500 font-bold px-1 py-1 text-lg rounded-3xl hover:shadow-md outlined-none"
                    >
                      <AiFillHeart />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        checkIfSaved();
                      }}
                      type="button"
                      className="bg-white opacity-70 hover:opacity-100 text-red-500 font-bold px-1 py-1 text-lg rounded-3xl hover:shadow-md outlined-none"
                    >
                      <AiOutlineHeart />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === userInfo?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100  font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
