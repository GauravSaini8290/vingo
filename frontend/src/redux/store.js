import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import itemSlice from "./itemsSlice"
import mapSlice from "./mapSlice"

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        item: itemSlice,
        map: mapSlice
    }
})