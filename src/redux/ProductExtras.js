import {createSlice} from "@reduxjs/toolkit";


const ProductExtras= createSlice({
    name:"cartIndex",
    initialState:{
        productExtras:[],
    },
    reducers:{
        addToExtrasswithRedux:(state,action)=>{
            state.productExtras=[];
            state.productExtras=action.payload;
        },
        reset:(state,action)=>{
            state.productExtras=[];
        }

    }
});
export const ProductExtrasActions=ProductExtras.actions;
export default ProductExtras.reducer;
