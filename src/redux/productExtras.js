import {createSlice} from "@reduxjs/toolkit";


const productExtras= createSlice({
    name:"cartIndex",
    initialState:{
        productExtras:[],
    },
    reducers:{
        addToExtrasswithRedux:(state,action)=>{
            state.productExtras=[];
            state.productExtras=action.payload;
        }
    }
});
export const productExtrasActions=productExtras.actions;
export default productExtras.reducer;
