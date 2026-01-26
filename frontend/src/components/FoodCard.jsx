import React, { useState, useEffect } from "react";
import { FaLeaf, FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const FoodCard = ({ data }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.user);

  // Initialize quantity from cart if item already exists
  const existingCartItem = cartItems.find((i) => i.id === data._id);
  const [quantity, setQuantity] = useState(existingCartItem ? existingCartItem.quantity : 0);

  // Sync quantity with Redux in case cart updates from elsewhere
  useEffect(() => {
    const item = cartItems.find((i) => i.id === data._id);
    if (item) setQuantity(item.quantity);
    else setQuantity(0); // reset if item removed from cart
  }, [cartItems, data._id]);

  // Render star rating dynamically
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  // Increment quantity
  const handleIncrease = () => setQuantity(quantity + 1);

  // Decrement quantity
  const handleDecrease = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  return (
    <div className="w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Image Section with Veg/Non-Veg Indicator */}
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data?.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>
        <img
          alt={data.name}
          src={data.image}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
      </div>

      {/* Name & Rating */}
      <div className="flex flex-1 flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">{data?.name}</h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">{data.rating?.count || 0}</span>
        </div>
      </div>

      {/* Price & Quantity/Cart Controls */}
      <div className="flex items-center justify-between mt-auto p-3">
        <span className="font-bold text-gray-900 text-lg">{data.price}</span>
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          {/* Decrease Button */}
          <button className="px-2 py-1 hover:bg-gray-100 transition" onClick={handleDecrease}>
            <FaMinus size={12} />
          </button>

          {/* Quantity Display */}
          <span className="px-2">{quantity}</span>

          {/* Increase Button */}
          <button className="px-2 py-1 hover:bg-gray-100 transition" onClick={handleIncrease}>
            <FaPlus size={12} />
          </button>

          {/* Add to Cart Button */}
          <button
            className={`${
              cartItems.some((i) => i.id === data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"
            } text-white px-3 py-2 transition-colors`}
            onClick={() => {
              if (quantity === 0) return; // Don't add if quantity is 0
              dispatch(
                addToCart({
                  id: data._id,
                  name: data.name,
                  price: data.price,
                  quantity,
                  shop: data.shop,
                  image: data.image,
                  foodType: data.foodType,
                })
              );
            }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
