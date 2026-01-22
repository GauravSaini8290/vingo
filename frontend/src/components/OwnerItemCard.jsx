import React from "react";

const OwnerItemCard = ({ Item }) => {
  console.log(Item);
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl ">
      <div className="w-36 h-full flex-shrink-0 bg-gray-50">
        <img
          src={Item?.image}
          alt=""
          className="w-full h-full object-cover"
        ></img>
      </div>
      <div className="flex   flex-col justify-between p-3 flex-1 ">
        <div>
          <h2 className="text-base font-semibold text-[#ff4d2d]  ">
            {Item?.name}
          </h2>
          <p className="">
            {" "}
            <span className="font-medium text-shadow-gray-700">
              category:
            </span>{" "}
            {Item?.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
