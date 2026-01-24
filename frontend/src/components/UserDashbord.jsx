import React, { useRef } from "react";
import Navbar from "./Navbar";
import categories from "../category.js";
import CategoryCard from "./CategoryCard";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard.jsx";

const UserDashbord = () => {
  const handleScroll = useRef();
  const shopScroll = useRef();
  const { location } = useSelector((store) => store.user);
  const { setShopsInMyCity, itemInMyCity } = useSelector((store) => store.user);
  

  const scrollHnadler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col gap-5 items-center overflow-y-auto">
      <Navbar />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inpiration for your first order
        </h1>
        <div className="w-full relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            onClick={() => scrollHnadler(handleScroll, "left")}
          >
            <FaArrowAltCircleLeft />
          </button>
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={handleScroll}
          >
            {categories?.map((c, index) => (
              <CategoryCard key={index} name={c?.category} image={c?.image} />
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            onClick={() => scrollHnadler(handleScroll, "right")}
          >
            <FaArrowAltCircleRight />
          </button>
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best shop in {location}{" "}
        </h1>
        <div className="w-full relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            onClick={() => scrollHnadler(shopScroll, "left")}
          >
            <FaArrowAltCircleLeft />
          </button>
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={shopScroll}
          >
            {setShopsInMyCity?.map((shop, index) => (
              <CategoryCard key={index} name={shop?.name} image={shop?.image} />
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            onClick={() => scrollHnadler(shopScroll, "right")}
          >
            <FaArrowAltCircleRight />
          </button>
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested food items
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemInMyCity?.map((item,index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashbord;
