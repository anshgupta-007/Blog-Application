import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signUpData: localStorage.getItem("signUpData") ? JSON.parse(localStorage.getItem("signUpData")) : [],
    token : localStorage.getItem("token") ? localStorage.getItem("token") : null,
    loading: false,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
}


const authSlice = createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
            console.log("Token set in local storage:", action.payload);
        },
        removeToken: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        },
        setSignUpData: (state, action) => {
            state.signUpData = action.payload;
            localStorage.setItem("signUpData", JSON.stringify(action.payload));
        },
        removeSignUpData: (state) => {
            state.signUpData = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        removeLoading: (state) => {
            state.loading = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
            console.log("User set in local storage:", action.payload);
        },
        removeUser: (state) => {
            state.user = null;
        }
    }
})

export const { setToken, removeToken, setSignUpData, removeSignUpData, setLoading, removeLoading, setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;