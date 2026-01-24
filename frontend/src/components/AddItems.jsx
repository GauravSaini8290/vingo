import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GiForkKnifeSpoon } from "react-icons/gi";
import axios from "axios";
import { ServerUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const AddItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const category = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwitch",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast food",
    "Other",
  ];
  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  const handleSubmit = async () => {
    if (!name || !frontendImage) {
      alert("All fields including image are required!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", Category);
      formData.append("foodType", foodType);
      formData.append("price", price);

      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post(ServerUrl + "/api/item/add-item", formData, {
        withCredentials: true,
      });
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
        className="absolute top-[20px] left-[20px] z-[10]  pointer-events-none"
       
      >
        <IoMdArrowBack size={30}   className="text-[#ff4d2d] cursor-pointer pointer-events-auto" onClick={() => navigate("/")}/>
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <GiForkKnifeSpoon className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">Add food</div>
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
              food image
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></input>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Cagegory
            </label>
            <select
              value={Category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">select</option>
              {category.map((cate, index) => (
                <option key={index}>{cate}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select food type
            </label>
            <select
              value={foodType}
              onChange={(e) => {
                setFoodType(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={"veg"}>veg</option>
              <option value={"nonveg"}>nonveg</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="relative z-20 w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white"/> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
