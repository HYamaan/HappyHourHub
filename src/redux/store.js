import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import indexCart from "./cartIndex";
import productExtras from "./productExtras";

export default  configureStore({
    reducer:{
        cart:cartSlice,
        cartIndex:indexCart,
        productExtras:productExtras,
    }
})