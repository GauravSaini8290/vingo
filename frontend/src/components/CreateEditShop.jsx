import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";
import axios from "axios";
import { ServerUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shopData } = useSelector((store) => store.owner);
  const { location, State, currentAddress } = useSelector(
    (store) => store.user,
  );
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);

  // 🔥 Sync Redux → Local State
  useEffect(() => {
    if (shopData) {
      setName(shopData?.name || "");
      setCity(shopData?.city || "");
      setState(shopData?.state || "");
      setAddress(shopData?.address || "");
      setFrontendImage(shopData?.image || "");
    } else {
      setCity(location || "");
      setState(State || "");
      setAddress(currentAddress || "");
    }
  }, [shopData, location, State, currentAddress]);
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  const handleSubmit = async () => {
    if (!name || !city || !state || !address || !frontendImage) {
      alert("All fields including image are required!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post(
        ServerUrl + "/api/shop/create-edit",
        formData,
        { withCredentials: true },
      );

      dispatch(setMyShopData(res.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer "
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={30} className="text-[#ff4d2d]" />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <GiForkKnifeSpoon className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {shopData ? "edit Shop" : "Add Shop"}
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></input>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleImage}
            ></input>
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="image"
                  className="w-full h-48 object-cover rounded-lg border"
                ></img>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></input>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></input>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter Shop Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></input>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white"/> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
