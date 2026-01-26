import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
    const cart = localStorage.getItem("cartItems");
    return cart ? JSON.parse(cart) : [];
};

const calculateTotalAmount = (cartItems) => {
    return cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        location: null,
        State: null,
        currentAddress: null,
        setShopsInMyCity: null,
        itemInMyCity: null,
        cartItems: getCartFromStorage(),
        totalAmount: calculateTotalAmount(getCartFromStorage())
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setCity: (state, action) => {
            state.location = action.payload;
        },
        setstate: (state, action) => {
            state.State = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setShopsInCity: (state, action) => {
            state.setShopsInMyCity = action.payload;
        },
        setItemsInCity: (state, action) => {
            state.itemInMyCity = action.payload;
        },

        addToCart: (state, action) => {
            const cartItem = action.payload;
            const existingItem = state.cartItems.find((i) => i.id === cartItem.id);
            if (existingItem) {
                existingItem.quantity = cartItem.quantity;
            } else {
                state.cartItems.push(cartItem);
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.totalAmount = calculateTotalAmount(state.cartItems);
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            state.totalAmount = calculateTotalAmount(state.cartItems);
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.setItem("cartItems", JSON.stringify([]));
            state.totalAmount = 0;
        }
    }
});

export const { setUserData, setCity, setstate, setCurrentAddress, setShopsInCity, setItemsInCity, addToCart, removeFromCart, clearCart } = userSlice.actions;
export default userSlice.reducer;
