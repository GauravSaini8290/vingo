import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServerUrl } from "../App";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "./FoodCard";

const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);

  const handleShop = async () => {
    try {
      const res = await axios.get(
        `${ServerUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true },
      );
      setShop(res.data.shop);
      setItems(res.data.item);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleShop();
  }, [shopId]);
  return (
    <div className="min-h-screen bg-gray-50">
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img src={shop.image} className="w-full object-cover h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black\200 to-black/50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-semibold text-white drop-shadow-lg">
              {shop.name}
            </h1>
            <p className="text-2xl font-medium text-white mt-[10px]">
              {shop.address}
            </p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-10 ">
        <h2 className="flex items-center justify-center gap-3 text-3xl text-gray-800 font-bold mb-10">
          <FaUtensils color="red" />
          Our Menu
        </h2>
        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item,index) => (
              <FoodCard data={item} key={index}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            {" "}
            No Items available
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;
