import {createSlice} from "@reduxjs/toolkit";


const FavoriteProducts = createSlice({
    name: "favoriteProducts",
    initialState: {
        favoriteProducts: [1,],
    },
    reducers: {
        addFavoriteProduct: (state, action) => {
            console.log("action.payload.props", state.favoriteProducts);

        },
        deleteProduct: (state, action) => {
            state.favoriteProducts = [];
        },
    },
});

export const FavoriteProductsActions=FavoriteProducts.actions;
export default FavoriteProducts.reducer;
