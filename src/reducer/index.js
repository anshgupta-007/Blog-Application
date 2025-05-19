// import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import blogSlice from "../slices/blogSlice";
const rootReducer = combineReducers({
    auth: authSlice,
    blog: blogSlice,
})

export default rootReducer;