import React from "react";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">
            Order #{data?._id ? data._id.slice(-6) : "------"}
          </p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data?.createdAt)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            {data?.paymentMethod?.toUpperCase() || "COD"}
          </p>
          <p className="font-medium text-blue-600">
            {data?.shopOrders?.[0]?.status || "Processing"}
          </p>
        </div>
      </div>

      {/* Shops */}
      {data?.shopOrders?.length > 0 &&
        data.shopOrders.map((shopOrder, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          >
            <p className="font-medium">
              {shopOrder?.shop?.name || "Shop"}
            </p>

            <div className="flex space-x-4 overflow-x-auto pb-2">
              {shopOrder?.shopOrderItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                >
                  <img
                    src={item?.item?.image}
                    alt="item"
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="font-semibold text-sm mt-1">
                    {item?.name}
                  </p>
                  <p className="text-xs text-gray-800">
                    QTY: {item?.quantity} x {item?.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-2">
              <p className="font-semibold">
                SubTotal: {shopOrder?.subTotal || 0}
              </p>
              <span className="text-sm font-medium text-blue-600">
                Status: {shopOrder?.status || "Processing"}
              </span>
            </div>
          </div>
        ))}

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">
          Total: {data?.totalAmount || 0}
        </p>
        <button
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
          onClick={() => navigate(`/track-order/${data?._id}`)}
        >
          Track order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
