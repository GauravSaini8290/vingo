import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoy = () => {
  const { userData } = useSelector((store) => store.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const [availableAssignment, setAvailableAssignment] = useState([]);
  const [showOtpBox, setShowOtpBox] = useState(false);

  const getAssignment = async () => {
    try {
      const res = await axios.get(`${ServerUrl}/api/order/my-assignment`, {
        withCredentials: true,
      });
      setAvailableAssignment(res.data || []);
    } catch (error) {
      console.error("Get Assignment Error:", error.response?.data || error.message);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${ServerUrl}/api/order/get-curent-order`, {
        withCredentials: true,
      });
      setCurrentOrder(res.data || null);
    } catch (error) {
      console.error("Get Current Order Error:", error.response?.data || error.message);
      setCurrentOrder(null);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const res = await axios.get(
        `${ServerUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log("Order Accepted:", res.data);
      await getCurrentOrder();
    } catch (error) {
      console.error("Accept Order Error:", error.response?.data || error.message);
    }
  };

  const sendOtp = async () => {
    if (!currentOrder || !currentOrder.shopOrder) {
      console.error("No current order/shopOrder to send OTP");
      return;
    }
    try {
      const res = await axios.post(
        `${ServerUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id || currentOrder.shopOrder.id,
        },
        { withCredentials: true }
      );
      console.log("OTP Sent:", res.data);
      setShowOtpBox(true);
    } catch (error) {
      console.error("Send OTP Error:", error.response?.data || error.message);
    }
  };

  const verifyOtp = async () => {
    if (!currentOrder || !currentOrder.shopOrder) {
      console.error("No current order/shopOrder to verify OTP");
      return;
    }
    try {
      const res = await axios.post(
        `${ServerUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id || currentOrder.shopOrder.id,
          otp,
        },
        { withCredentials: true }
      );
      console.log("OTP Verified:", res.data);
      setShowOtpBox(false);
      setOtp("");
      await getCurrentOrder();
    } catch (error) {
      console.error("Verify OTP Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error verifying OTP");
    }
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
            <span className="font-semibold">Longitude: </span>
            {userData?.location?.coordinates?.[0]}
          </p>
        </div>

        {/* Available Orders */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>
            <div className="space-y-4">
              {availableAssignment.length > 0 ? (
                availableAssignment.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Deliver Address: </span>
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
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {/* Current Order */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-3">📦 Current Orders</h1>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                Shop- {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                Address- {currentOrder?.deliveryAssignment?.text}
              </p>
              <p className="text-xs text-gray-600">
                {currentOrder?.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder?.shopOrder.subTotal}
              </p>
            </div>

            <DeliveryBoyTracking data={currentOrder} />

            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                onClick={sendOtp}
              >
                Mark As Delivered
              </button>
            ) : (
              <div className="border rounded-xl mt-4 p-4 bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP Sent To{" "}
                  <span className="text-orange-500">{currentOrder.user.fullName}</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  className="w-full border px-3 py-2 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  className="bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer w-full"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
