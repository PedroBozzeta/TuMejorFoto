import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const [slowConnection, setSlowConnection] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setSlowConnection(true);
    }, 3000);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/pins?categoryId=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          clearTimeout(timeoutId);
          setPins(data);
          setLoading(false);
          setSlowConnection(false);
        }, 8000);
      })
      .catch((error) => {
        console.error("Error fetching pins:", error);
        clearTimeout(timeoutId);
        setLoading(false);
        setSlowConnection(false);
      });

    return () => clearTimeout(timeoutId);
  }, [categoryId]);

  if (loading)
    if (slowConnection) {
      return (
        <Spinner
          message="La carga de imágenes puede tardar un poco debido a que el servidor necesita reactivarse tras periodos de inactividad. ¡Gracias
    por tu paciencia!"
        />
      );
    } else {
      return <Spinner message="Cargando escenarios fantásticos ..." />;
    }

  if (!pins?.length)
    return <h2 className="text-center">Ninguna imagen disponible</h2>;
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
