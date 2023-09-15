import React from "react";
import { Oval } from "react-loader-spinner";
const Circle = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Oval
        type="Circles"
        color="#00BFFF"
        height={50}
        width={200}
        className="m-5"
      />
    </div>
  );
};

export default Circle;
