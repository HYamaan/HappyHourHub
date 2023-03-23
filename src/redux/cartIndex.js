import {createSlice} from "@reduxjs/toolkit";


const indexCart= createSlice({
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
export const cartIndexActions=indexCart.actions;
export default indexCart.reducer;
