import {createSlice} from "@reduxjs/toolkit";


const ShoppingOrder = createSlice({
    name: "favoriteProducts",
    initialState: {
        shoppingOrder: [],
    },
    reducers: {
        addShoppingOrder: (state, action) => {
            state.shoppingOrder.push(action.payload);

        },
        deleteShoppingOrder: (state, action) => {
            state.shoppingOrder = [];
        },
    },
});

export const ShoppingOrderActions=ShoppingOrder.actions;
export default ShoppingOrder.reducer;
