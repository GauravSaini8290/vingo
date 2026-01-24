import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ServerUrl } from "../App";
import { setShopsInCity } from "../redux/userSlice";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((store) => store.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/shop/get-by-city/${location}`,
          { withCredentials: true },
        );
          
        dispatch(setShopsInCity(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, [location]);
};
export default useGetShopByCity;
