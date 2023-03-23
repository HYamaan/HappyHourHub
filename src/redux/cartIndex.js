import {createSlice} from "@reduxjs/toolkit";


const cartIndex= createSlice({
    name:"cartIndex",
    initialState:{
        addToIndex:0,
    },
    reducers:{
        addToCartIndex:(state,action)=>{
            console.log("addToIndex",action.payload);
            state.addToIndex++;
        }
    }
});
export const cartIndexActions=cartIndex.actions;
export default cartIndex.reducer;
