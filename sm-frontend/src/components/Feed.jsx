import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/pins?categoryId=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pins:", error);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading)
    return <Spinner message="Estamos cargando nuevas imágenes para tí!" />;
  if (!pins?.length)
    return <h2 className="text-center">Ninguna imagen disponible</h2>;
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
