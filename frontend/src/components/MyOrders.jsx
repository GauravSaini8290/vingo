import React from "react";
import { useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "./UserOrderCard";
import OwnerOrderCard from "./OwnerOrderCard";
import useGetMyOrders from "../hooks/useGetMyOrders";
const MyOrders = () => {
  const navigate = useNavigate();
  const { userData, myOrders } = useSelector((store) => store.user);
useGetMyOrders();
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4 ">
      <div className="w-full max-w-[800px] p-4">
        <div className="z-[10] " onClick={() => navigate("/")}>
          <IoMdArrowBack
            size={30}
            className="absolute top-5 left-5 text-[#ff4d2d] cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>
        <div className="space-y-6 mt-6">
          {myOrders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
              <p className="text-lg font-semibold">No orders available</p>
              <p className="text-sm">You haven’t placed any orders yet</p>
            </div>
          ) : (
            myOrders.map((order, index) =>
              userData?.role === "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData?.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null,
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
