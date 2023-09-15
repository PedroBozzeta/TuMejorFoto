import React, { useEffect, useState } from "react";

import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== "") {
      setLoading(true);
      fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/pins?categoryId=${searchTerm.toLowerCase()}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching pins:", error);
          setLoading(false);
        });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Buscando imágenes" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl ">
          Sin imágenes encontradas!
        </div>
      )}
    </div>
  );
};

export default Search;
