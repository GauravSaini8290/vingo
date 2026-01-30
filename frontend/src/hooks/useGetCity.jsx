import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setCurrentAddress, setstate } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((store) => store.user);
  const apiKey = import.meta.env.VITE_GIOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
      );
      dispatch(setCity(res?.data?.results?.[0]?.city||res?.data?.results?.[0]?.county));
      dispatch(setstate(res?.data?.results?.[0]?.state));
      dispatch(
        setCurrentAddress(
          res?.data?.results?.[0]?.address_line2 ||
            res?.data?.results?.[0]?.address_line1,
        ),
      );
      dispatch(setAddress(res?.data?.results?.[0]?.address_line2));
    });
  }, [userData]);
};

export default useGetCity;
