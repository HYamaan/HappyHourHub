import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import cartIndex from "./cartIndex";
import productExtras from "./productExtras";

export default  configureStore({
    reducer:{
        cart:cartSlice,
        cartIndex:cartIndex,
        productExtras:productExtras,
    }
})