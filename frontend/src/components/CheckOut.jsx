import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { FaMobileScreen } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { ServerUrl } from "../App";
import { addMyOrder } from "../redux/userSlice";
const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 16, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
};

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressInput, setAddressInput] = useState("");
  const navigate = useNavigate();
  const { location, address } = useSelector((store) => store.map);
  const { cartItems, totalAmount } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GIOAPIKEY;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFees = totalAmount + deliveryFee;

  const ondragend = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat: lat, lon: lng }));
    getAddressByLating(lat, lng);
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLating(latitude, longitude);
    });
  };
  const getAddressByLating = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`,
      );
      dispatch(setAddress(res?.data?.results?.[0]?.address_line1));
    } catch (error) {
      console.log(error);
    }
  };
  const getLatingByAddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );
      const { lat, lon } = res.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleplaceOrder = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/order/place-order",
        {
          cartItems,
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount,
        },
        { withCredentials: true },
      );
      dispatch(addMyOrder(res.data));
      navigate("/order-placed");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setAddressInput(address);
  }, [address]);
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="z-[10] absolute top-[20px] left-[20px] "
        onClick={() => {
          navigate("/cart");
        }}
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">checkOut</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800 ">
            <CiLocationOn size={25} className="text-[#ff4d2d]" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] "
              placeholder="Enter your Address.."
            ></input>
            <button
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
              onClick={getLatingByAddress}
            >
              <IoSearchOutline />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation />
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border">
            <div className="h-64 w-full flex items-center justify-center">
              {location?.lat && location?.lon ? (
                <MapContainer
                  className="w-full h-full"
                  center={[location.lat, location.lon]}
                  zoom={16}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecenterMap location={location} />
                  <Marker
                    position={[location.lat, location.lon]}
                    draggable
                    eventHandlers={{ dragend: ondragend }}
                  ></Marker>
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Fetching your location...
                </div>
              )}
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method{" "}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 cursor-pointer rounded-xl border p-4 text-left ${paymentMethod === "cod" ? " border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"} `}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-xl text-green-600" />
              </span>
              <div>
                <p className="font-medium text-gray-800 "> Cash on Delivery</p>
                <p className="text-xs text-gray-500 ">
                  {" "}
                  Pay with your food arrives
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 cursor-pointer rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? " border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}  }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreen className="text-lg text-purple-700" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaCreditCard className="text-xl text-blue-700" />
              </span>
              <p className="font-medium text-gray700 "> UPI / Debit Card</p>
              <p className="text-xs text-gray-500">Pay Securely Online </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semi-bold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl bg-gray-50 space-y-2 border p-4">
            {cartItems?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span className="font-semibold">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">{item.price}</span>
              </div>
            ))}
            <hr className="border-gray-400 my-2"></hr>
            <div className="flex justify-between font-medium text-gray-800">
              <span>SubTotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>DeliveryFee</span>
              <span>{deliveryFee === 0 ? "Free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total </span>
              <span>{amountWithDeliveryFees}</span>
            </div>
          </div>
        </section>
        <button
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold cursor-pointer"
          onClick={handleplaceOrder}
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay & place Order "}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
