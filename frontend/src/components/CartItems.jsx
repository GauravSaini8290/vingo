import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import CartItemCard from "./CartItemCard";
const Cart = () => {
  const { cartItems, totalAmount } = useSelector((store) => store.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-cneter gap-[20px] mb-6">
          <div className="z-[10] " onClick={() => navigate("/")}>
            <IoMdArrowBack
              size={30}
              className="absolute top-5 left-5 text-[#ff4d2d] cursor-pointer"
            />
            <h1 className="text-2xl font-bold text-start">Your cart</h1>
          </div>
        </div>
        {cartItems?.length === 0 ? (
          <p>your cart is Empy</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index} />
              ))}
            </div>
            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
              <h1 className="text-1g font-semibold">Total Amount</h1>
              <span className="text-xl font-bold text-[#ff4d2d]">
                ₹{totalAmount}
              </span>
            </div>
            <div
              className="mt-4 flex justify-end"
              onClick={() => navigate("/checkOut")}
            >
              <button className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-1g font-medium hover:bg-[#e64526] transition cursor-pointer">
                Proceed to CheckOut
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
