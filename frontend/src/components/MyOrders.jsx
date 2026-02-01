import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "./UserOrderCard";
import OwnerOrderCard from "./OwnerOrderCard";
import { useEffect } from "react";
import { setMyOrders } from "../redux/userSlice";
const MyOrders = () => {
  const navigate = useNavigate();
  const { userData, myOrders, socket } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket || !userData) return;

    const handleNewOrder = (data) => {
      console.log("New Order Received:", data); // Debugging ke liye
      const ownerId = data.shopOrders?.owner?._id || data.shopOrders?.owner;

      if (ownerId === userData._id) {
        // Direct data bhejein, purani list handle karne ke liye reducer ko update karein (niche dekhein)
        // Ya fir state update logic ko safe banayein:
        dispatch(setMyOrders([data, ...myOrders]));
      }
    };

    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("newOrder", handleNewOrder);
    };
    // myOrders ko yahan se hata dein taaki listener stable rahe
  }, [socket, userData?._id, dispatch]);

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
        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData?.role === "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData?.role === "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
