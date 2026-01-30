import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import { setUserData } from "./redux/userSlice";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./components/CreateEditShop";
import AddItems from "./components/AddItems";
import EditItem from "./components/EditItem";
import useGetShopByCity from "./hooks/useGetShopById";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import Cart from "./components/cartItems";
import CheckOut from "./components/CheckOut";
import OrderPlaced from "./components/OrderPlaced";
import MyOrders from "./components/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";

export const ServerUrl = "http://localhost:8000";

const App = () => {
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/current`, {
          withCredentials: true,
        });

        dispatch(setUserData(res.data.user));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" replace />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" replace />}
      />

      <Route
        path="/forgot-password"
        element={!userData ? <ForgetPassword /> : <Navigate to="/" replace />}
      />

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/create-edit-shop"
        element={
          userData ? <CreateEditShop /> : <Navigate to="/signin" replace />
        }
      />
      <Route
        path="/Add-food"
        element={userData ? <AddItems /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/Edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/cart"
        element={userData ? <Cart /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/checkOut"
        element={userData ? <CheckOut /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to="/signin" replace />}
      />
    </Routes>
  );
};

export default App;
