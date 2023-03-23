import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import cartIndex from "./cartIndex";
import ProductExtras from "./ProductExtras";

export default  configureStore({
    reducer:{
        cart:cartSlice,
        cartIndex:cartIndex,
        productExtras:ProductExtras,
    }
})