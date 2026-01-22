import React from "react";
import { useSelector } from "react-redux";
import UserDashbord from "./UserDashbord";
import Owner from "./owner";
import DeliveryBoy from "./deliveryBoy";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]">
      {userData?.role === "user" && <UserDashbord />}
      {userData?.role === "owner" && <Owner />}
      {userData?.role === "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
};

export default Home;
