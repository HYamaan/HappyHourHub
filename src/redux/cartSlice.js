import {createSlice} from "@reduxjs/toolkit";



const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [],
        totalQuantity: 0,
        total: 0,
    },
    reducers: {
        addProduct: (state, action) => {

            state.totalQuantity ++;
            state.products.push(action.payload);
            state.total += action.payload.price;


        },
        // addProduct1: (state, action) => {
        // const existingItem = state.products.find((item)=>item.id === action.payload.id);
        //  const existingStateProductsFilter = state.products.filter(item=>item.id === action.payload.id);
        //   const existingStateProductsMap = existingStateProductsFilter.map(item=> item.extras)
        //
        //  const stateItem = JSON.parse(JSON.stringify(existingStateProductsMap));
        // -------------------------------------------------------------------------------
        //   console.log(stateItem)
        //     const newItem = action.payload;
        //     //console.log("Extras",newItem.extras.length)
        //     //console.log(state.products.map(item=>item.extras.map(item=>console.log(item.id))))
        //     const existingItem = state.products.find((item)=>item.id === newItem.id);
        //     const existingProduct=
        //
        //     state.totalQuantity += 1;
        //     const stateItem = JSON.parse(JSON.stringify(state.products));
        //     console.log(stateItem);
        //     if(existingItem){
        //
        //         existingItem.quantity++
        //         existingItem.price +=newItem.price;
        //         state.total= state.total + newItem.price;
        //     }
        //     else{
        //         state.products.push(action.payload);
        //         state.total += action.payload.price
        //     }
        //
        //
        // },
        reset: (state, action) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        }
    }
});
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;