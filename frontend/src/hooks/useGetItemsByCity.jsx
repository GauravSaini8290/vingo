import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ServerUrl } from "../App";
import { setItemsInCity } from "../redux/userSlice";

const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((store) => store.user);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/item/getItemsByCity/${location}`,
          { withCredentials: true },
        );
    
        dispatch(setItemsInCity(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [location]);
};
export default useGetItemsByCity;
