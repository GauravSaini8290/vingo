import { useEffect } from "react";
import { ServerUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const fetchShop = async () => {
    try {
      const res = await axios.get(ServerUrl + "/api/shop/getMyShop", {
        withCredentials: true,
      });
      dispatch(setMyShopData(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchShop();
  }, []);
};
export default useGetMyShop;
