import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        location: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCity: (state, action) => {
            state.location = action.payload
        }
    }
})
export const { setUserData,setCity } = userSlice.actions
export default userSlice.reducer