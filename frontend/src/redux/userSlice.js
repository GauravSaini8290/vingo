import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        location: null,
        State: null,
        currentAddress: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCity: (state, action) => {
            state.location = action.payload
        },
        setstate: (state, action) => {
            state.State = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        }
    }
})
export const { setUserData, setCity, setstate, setCurrentAddress } = userSlice.actions
export default userSlice.reducer