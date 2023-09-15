import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUrlFunction } from "../clientFront";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [url, setUrl] = useState("");
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);

  const fetchPinDetails = () => {
    if (pinId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/pin-details?pinId=${pinId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.pinData) {
            setPinDetail(data.pinData);
            setPins(data.relatedPins);
            setComments(data.comments);
          }
        });
      fetchData();
    }
  };
  const fetchData = async () => {
    const data = await getUrlFunction(pinId);
    setUrl(data.imageUrl);
  };
  const addComment = () => {
    if (comment && user) {
      setAddingComment(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/comment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinId: pinId,
          userId: user?._id,
          comment: comment,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.send) {
            console.log("Comentario enviado");
          } else {
            console.log("Error al enviar el comentario");
          }
        })
        .then(() => {
          setCommentAdded(true);
        });
    }
  };

  useEffect(() => {
    setComment("");
    setAddingComment(false);
    fetchPinDetails();
  }, [commentAdded]);
  useEffect(() => {
    fetchPinDetails();
  }, [pinId, comments]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addComment();
    }
  };

  if (!pinDetail) {
    return <Spinner message="Mostrando imagen" />;
  }
  const getAbsoluteURL = (url) => {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      return "http://" + url;
    }
    return url;
  };
  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail?.image && url}
              alt="user-post"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail?.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a
                href={getAbsoluteURL(pinDetail.destination)}
                target="_blank"
                rel="noreferrer"
              >
                {pinDetail.destination?.slice(0, 20)}...
              </a>
            </div>
            <Link
              to={`/user-profile/${pinDetail?.postedBy?._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg "
            >
              <img
                src={pinDetail?.postedBy?.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{pinDetail?.postedBy?.userName}</p>
            </Link>
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>
            {pinDetail?.comments && (
              <h2 className="mt-5 font-bold text-1xl">Comentarios</h2>
            )}
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item._key}
                >
                  <Link to={`/user-profile/${item?.postedBy?._id}`}>
                    <img
                      src={item.postedBy?.image}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                  </Link>
                  <div className="flex flex-col ">
                    <Link to={`/user-profile/${item?.postedBy?._id}`}>
                      <p className="font-bold cursor-pointer">
                        {item.postedBy?.userName}
                      </p>
                    </Link>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <div className="flex flex-wrap mt-6 gap-3">
                <Link to={`/user-profile/${user?._id}`}>
                  <img
                    src={user?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <input
                  className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                  type="text"
                  placeholder="Añade un comentario"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                  onClick={addComment}
                >
                  {addingComment ? "Enviando..." : "Enviar"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          Más como esta
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Cargando más imágenes" />
      )}
    </>
  );
};

export default PinDetail;
