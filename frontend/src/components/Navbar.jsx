import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.user);
  const { location } = useSelector((state) => state.user);
  const { shopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showInfo, setshowInfo] = useState(false);
  const [showSearch, setshowSearch] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(ServerUrl + "/api/auth/signOut", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6]  overflow-visible">
      {showSearch && userData.role === "user" && (
        <div className="w-[90%] h-[70px] bg-white shadow-lg rounded-lg items-center gap-[20px] flex fixed top-[80px] left=[5%]">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <CiLocationOn className="w-[25px] h-[25px] text-[#ff4d2d]" />
            <div className="w-[8-%] truncate text-gray-600">{location}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoMdSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="search"
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d] ">Vingo</h1>
      {userData.role === "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-lg rounded-lg items-center gap-[20px] hidden md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <CiLocationOn className="w-[25px] h-[25px] text-[#ff4d2d]" />
            <div className="w-[8-%] truncate text-gray-600">{location}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoMdSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="search"
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {userData.role === "user" &&
          (showSearch ? (
            <RxCross1
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setshowSearch(false)}
            />
          ) : (
            <IoMdSearch
              size={25}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setshowSearch(true)}
            />
          ))}
        {userData.role === "owner" ? (
          <>
            {shopData && (
              <>
                <button
                  className="hidden md:flex itmes-center gap-3 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] "
                  onClick={() => navigate("/Add-food")}
                >
                  <FaPlus size={20} />
                  <span> Add food items</span>
                </button>
                <button
                  className="md:hidden  flex itmes-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] "
                  onClick={() => navigate("/Add-food")}
                >
                  <FaPlus size={20} />
                </button>
              </>
            )}

            <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10  text-[#ff4d2d] font-medium">
              <MdOutlineReceiptLong size={20} className="text-[#ff4d2d]" />
              <span className="">My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px] ">
                0
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10  text-[#ff4d2d] font-medium">
              <MdOutlineReceiptLong size={20} className="text-[#ff4d2d]" />

              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px] ">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="relative cursor-pointer" onClick={()=>navigate("/cart")}>
              <IoCartOutline size={25} className="text-[#ff4d2d]" />
              <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                {cartItems.length}
              </span>
            </div>

            <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium ">
              My Order
            </button>
          </>
        )}

        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
          onClick={() => setshowInfo((value) => !value)}
        >
          {userData?.fullName.slice(0, 1)}
        </div>
        {showInfo && (
          <div className="fixed top-[80px] right-[10px] md:right-[25%]  w-[180px] lg-right-[25%] bg-white shadow-xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold">
              {userData?.fullName}
            </div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My Order
            </div>
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              logOut
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
