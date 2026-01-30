import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import {useNavigate} from "react-router-dom"
const OrderPlaced = () => {
    const navigate  = useNavigate()
  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      <FaCircleCheck className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2"> Order Placed !</h1>
      <p className="text-gray-600 mx-w-md mb-6">
        {" "}
        Thank you for your purchase. your order is being prepared you can track
        your order status in the "My Order section"{" "}
      </p>
      <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition cursor-pointer" onClick={() => navigate("/my-orders")}> Back  to My Orders</button>
    </div>
  );
};

export default OrderPlaced;
