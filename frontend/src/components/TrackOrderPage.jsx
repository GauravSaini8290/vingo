import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { IoMdArrowBack } from "react-icons/io";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();
  console.log(currentOrder);
  const handleGetOrder = async () => {
    try {
      const res = await axios.get(
        `${ServerUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOrder();
  }, [orderId]);
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
      <IoMdArrowBack
        size={30}
        className="absolute top-5 left-5 text-[#ff4d2d] cursor-pointer"
        onClick={() => navigate("/")}
      />

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-200 space-y-4"
          key={index}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d] ">
              {shopOrder.shop.name}
            </p>

            <p className="font-semibold">
              <span>Items: </span>
              {shopOrder.shopOrderItems?.map((i) => i.name).join(",")}
            </p>
            <p className="font-semibold">
              <span>SubTotal: </span>
              {shopOrder.subTotal}
            </p>
            <p className="mt-6">
              <span className="font-semibold">DeliveryAddress: </span>
              {currentOrder?.deliveryAddress?.text}
            </p>
          </div>
          {shopOrder.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    <span>Delivery Boy Name: </span>{" "}
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Delivery Boy Contact Number: </span>{" "}
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">Delivery Boy not Assigned yet</p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">Delivered </p>
          )}
          {shopOrder.assignedDeliveryBoy &&
            shopOrder.status !== "delivered" && (
              <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: {
                      lat: shopOrder.assignedDeliveryBoy.location
                        .coordinates[1],
                      lon: shopOrder.assignedDeliveryBoy.location
                        .coordinates[0],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default TrackOrderPage;
