import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../redux/userSlice";
const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt="image"
          className="w-20 h-20 object-cover rounded-lg border"
        ></img>
        <div className="">
          <h1 className="font-medium text-gray-800 ">{data.name}</h1>
          <p className="text-sm text-gray-500">
            {data.price}x {data.quantity}
          </p>
          <p className="font-bold text-gray-900">
            {" "}
            {data.price * data.quantity}
          </p>
        </div>
      </div>
      <button
        className="bg-red-100 p-2 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
        onClick={() => dispatch(removeFromCart(data.id))}
      >
        <MdDeleteForever size={22} />
      </button>
    </div>
  );
};

export default CartItemCard;
