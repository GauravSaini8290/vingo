import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity, setCurrentAddress, setstate } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

const useGetCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // 1. Set coordinates
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        // 2. ✅ FREE OpenStreetMap Nominatim API (No key needed)
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
          {
            headers: {
              'User-Agent': 'YourAppName/1.0' // Required by OSM
            }
          }
        );

        if (res.data?.address) {
          const data = res.data.address;
          
          // OSM address structure mapping
          const city = data.city || data.town || data.village || data.hamlet || data.suburb || "Unknown City";
          const state = data.state || data.region || data.province || "Unknown State";
          
          dispatch(setCity(city));
          dispatch(setstate(state));
          
          const fullAddress = `${city}, ${state}`.trim();
          dispatch(setCurrentAddress(fullAddress));
          dispatch(setAddress(fullAddress));
          
          console.log("✅ Location fetched:", fullAddress);
        }
      } catch (error) {
        console.error("Location API failed:", error.message);
        // Safe fallback
        dispatch(setCity("Jaipur"));
        dispatch(setstate("Rajasthan"));
        dispatch(setCurrentAddress("Jaipur, Rajasthan"));
        dispatch(setAddress("Jaipur, Rajasthan"));
      }
    }, (error) => {
      console.error("Geolocation denied:", error);
      // Fallback for permission denied
      dispatch(setCity("Jaipur"));
      dispatch(setstate("Rajasthan"));
    });
  }, [dispatch]);

  return null;
};

export default useGetCity;