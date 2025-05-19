import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    draftId: null,
    blog: null,

}


const blogSlice = createSlice({
    name:"blog",
    initialState: initialState,
    reducers:{
        setDraftId: (state, action) => {
            state.draftId = action.payload;
        },
        removeDraftId: (state) => {
            state.draftId = null;
        },
        setBlog: (state, action) => {
            state.blog = action.payload;
        },
        removeBlog: (state) => {
            state.blog = null;
        }
    
    }
})

export const { setDraftId,removeDraftId,setBlog,removeBlog } = blogSlice.actions;
export default blogSlice.reducer;