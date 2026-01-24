import { useEffect } from "react";
import { ServerUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((store) => store.user)
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
  }, [userData]);
};
export default useGetMyShop;
