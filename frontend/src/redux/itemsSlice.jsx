
import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
    name: "item",
    initialState: {
        itemData: null,
    
    
    },
    reducers: {
        setMyItemData: (state, action) => {
            state.shopData = action.payload
        },
      
    }
})
export const { setMyItemData } = itemSlice.actions
export default itemSlice.reducer