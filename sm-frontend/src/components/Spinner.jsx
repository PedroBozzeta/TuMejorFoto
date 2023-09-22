import React from "react";
import { Triangle } from "react-loader-spinner";
const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-8">
      <Triangle
        type="Circles"
        color="#5f483c"
        height={50}
        width={200}
        className="m-5"
      />
      <p className="text-base text-center p-2 max-w-[500px]">{message}</p>
    </div>
  );
};

export default Spinner;
