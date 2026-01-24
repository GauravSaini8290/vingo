import React from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
const OwnerItemCard = ({ Item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDeleteItem = async () => {
    try {
      const res = await axios.get(`${ServerUrl}/api/item/delete/${Item._id}`, {
        withCredentials: true,
      });
      dispatch(setMyShopData(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl ">
      <div className="w-36 h-32 flex-shrink-0 bg-gray-50">
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
            <span className="font-medium text-shadow-gray-700">
              category :{" "}
            </span>
            {Item?.category}
          </p>
          <p className="">
            {" "}
            <span className="font-medium text-shadow-gray-700">
              Food Type :
            </span>{" "}
            {Item?.foodType}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[#ff4d2d] font-bold ">{Item?.price}</div>
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer"
              onClick={() => navigate(`/Edit-item/${Item._id}`)}
            >
              {" "}
              <MdEdit size={16} />
            </div>
            <div
              className="p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer "
              onClick={handleDeleteItem}
            >
              {" "}
              <FaTrashAlt size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
