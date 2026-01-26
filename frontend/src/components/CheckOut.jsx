import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

const CheckOut = () => {
  const navigate = useNavigate();
  const { location, address } = useSelector((store) => store.map);
  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="z-[10] absolute top-[20px] left-[20px] "
        onClick={() => {
          navigate("/");
        }}
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="w-full mx-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">checkOut</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800 ">
            <CiLocationOn size={25} className="text-[#ff4d2d]" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] "
              placeholder="Enter your Address.."
            ></input>
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <IoSearchOutline />
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
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
                  <Marker position={[location.lat, location.lon]}></Marker>
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Fetching your location...
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckOut;
