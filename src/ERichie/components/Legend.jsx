import React from "react";

const Legend = (data) => {
  const { shopid, shopname } = data;
  return (
    <div className="flex items-center justify-start text-center p-1">
      <h2 className="font-semibold px-2">{shopid} - </h2>
      <p>{shopname}</p>
    </div>
  );
};

export default Legend;
