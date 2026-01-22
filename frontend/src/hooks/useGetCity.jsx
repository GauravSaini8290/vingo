import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GIOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
      );

      dispatch(setCity(res?.data?.results?.[0]?.city));
    });
  }, []);
};

export default useGetCity;
