import { useEffect } from "react";
import { ServerUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((store) => store.user);
  const fetchOrders = async () => {
    try {
      const res = await axios.get(ServerUrl + "/api/order/my-orders", {
        withCredentials: true,
      });

      dispatch(setMyOrders(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    fetchOrders();
  }, [userData]);
};
export default useGetMyOrders;
