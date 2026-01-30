import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoy = () => {
  const { userData } = useSelector((store) => store.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableAssignment, setAvailableAssignment] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const getAssignment = async () => {
    try {
      const res = await axios.get(ServerUrl + "/api/order/my-assignment", {
        withCredentials: true,
      });
      setAvailableAssignment(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${ServerUrl}/api/order/get-curent-order`, {
        withCredentials: true,
      });
      console.log(res.data);
      setCurrentOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const res = await axios.get(
        `${ServerUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        },
      );
      console.log(res.data);
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSendOtp = () => {
    setShowOtpBox(true);
  };
  useEffect(() => {
    getAssignment();
    getCurrentOrder();
  }, [userData]);
  return (
    <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col gap-5 items-center overflow-y-auto">
      <Navbar />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex justify-start flex-col text-center gap-4 items-center w-[90%] border border-orange-100">
          <h1 className="text-xl font-bold text-[#ff4d2d] ">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-[#ff4d2d] ">
            <span className="font-semibold">Latitude: </span>
            {userData?.location?.coordinates?.[1]},
            <span className="font-semibold">longitude: </span>
            {userData?.location?.coordinates?.[0]}
          </p>
        </div>
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2 ">
              {" "}
              Available Orders
            </h1>

            <div className="space-y-4 ">
              {availableAssignment?.length > 0 ? (
                availableAssignment?.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="tex-sm font-semibold"> {a.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold"> DeliverAddress:</span>
                        {a.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items.shopOrderItems.length} items | {a.subTotal}
                      </p>
                    </div>
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-amber-600 cursor-pointer"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm "> No Available Orders</p>
              )}
            </div>
          </div>
        )}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100 ">
            <h1 className="text-lg font-bold mb-3">📦Current Orders</h1>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                Shop- {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                Address- {currentOrder?.deliveryAssignment?.text}
              </p>
              <p className="text-xs text-gray-600 ">
                {currentOrder?.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder?.shopOrder.subTotal}
              </p>
            </div>
            <DeliveryBoyTracking data={currentOrder} />
            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold  py-2 px-4 rounded-lg cursor-pointer shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                onClick={handleSendOtp}
              >
                Mark As Delivered
              </button>
            ) : (
              <div className="border rounded-xl mt-4 p-4 bg-gray-50">
                <p className="tex-sm font-semiboldmb-2">
                  Enter OTP Send To{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  type="text" 
                  placeholder="Enter OTP"
                  className="w-full border px-3 py-2 rounded-lg m b-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                ></input>
                <button className="bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer w-full">Submit OTP</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
