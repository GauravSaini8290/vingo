import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";
import axios from "axios";
import { ServerUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwich",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast food",
    "Other",
  ];

  /* ---------------- GET ITEM BY ID ---------------- */
  useEffect(() => {
    const getItem = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/item/get-by-id/${itemId}`,
          { withCredentials: true },
        );

        const item = res.data;
        setName(item.name);
        setCategory(item.category);
        setFoodType(item.foodType);
        setPrice(item.price);
        setFrontendImage(item.image);
      } catch (err) {
        console.log(err);
      }
    };

    getItem();
  }, [itemId]);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!name || !category || !foodType || !price) {
      alert("All fields are required");
      return;
    }
setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const res = await axios.put(
        `${ServerUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true },
      );

      dispatch(setMyShopData(res.data));
      setLoading(false)
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-50 relative">
      <IoMdArrowBack
        size={30}
        className="absolute top-5 left-5 text-[#ff4d2d] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-3">
            <GiForkKnifeSpoon className="text-[#ff4d2d] w-14 h-14" />
          </div>
          <h2 className="text-2xl font-bold">Edit Food Item</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Food name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {frontendImage && (
            <img
              src={frontendImage}
              alt="preview"
              className="w-full h-44 object-cover rounded-lg"
            />
          )}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Food Type</option>
            <option value="veg">Veg</option>
            <option value="non veg">Non Veg</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-lg font-semibold cursor-pointer" disabled={loading}
          >
            {loading?<ClipLoader size={20} color="white"/>:"Save Changes"}
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
