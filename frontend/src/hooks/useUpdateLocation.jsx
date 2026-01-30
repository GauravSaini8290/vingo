import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ServerUrl } from "../App";

const useUpdateLocation = () => {
  //   const dispatch = useDispatch();
  const { userData } = useSelector((store) => store.user);


 useEffect(() => {
  if (!userData) return;

  const updateLocation = async (lat, lon) => {
    
    try {
      const res = await axios.post(
        `${ServerUrl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      
    } catch (err) {
      console.log("API error:", err.message);
      
    }
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      updateLocation(
        pos.coords.latitude,
        pos.coords.longitude
      );
    },
    (err) => {
      console.log("Geo error:", err.message);
    }
  );
}, [userData]);

};

export default useUpdateLocation;
