import {createSlice} from "@reduxjs/toolkit";


const userInfo= createSlice({
    name:"cartIndex",
    initialState:{
        email:"",
        id:""
    },
    reducers:{
        userInfo:(state,action)=>{
            state.email =action.payload.email;
            state.id =action.payload.id;
        },
        userInfoReset:(state)=>{
            state.email ="";
            state.id ="";
        }
    }
});
export const userInfoActions=userInfo.actions;
export default userInfo.reducer;
