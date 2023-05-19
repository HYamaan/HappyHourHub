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
            const extras = action.payload.extras;

            const existingProductIndex = state.products.findIndex((item) => {
                return (
                    item._id === action.payload._id &&
                    item.extras.length === extras.length &&
                    item.extras.every((value, index) => {
                        console.log("index",value._id, extras[index]._id); return value._id === extras[index]._id})
                );
            });

            if (existingProductIndex !== -1) {
                state.products[existingProductIndex].productTotal += 1;

            } else {

                const newProduct = {
                    ...action.payload,
                };
                state.products.push(newProduct);

            }

            state.totalQuantity++;
            state.total += action.payload.price;
        },
        increaseProduct: (state, action) => {

            // const itemIndex = state.products.findIndex((item)=>item._id === action.payload._id);

            let addItemIndex = 0;
            //const itemIndex = state.products.findIndex((item)=>item.addIndex === action.payload.item.addIndex);
            state.products.forEach((item, index) => {
                if (item.addIndex === action.payload.addIndex) {
                    addItemIndex = index;
                }
            });

            if (addItemIndex >= 0) {
                state.totalQuantity++;
                state.total += action.payload.price;
                const tempProduct = {...action.payload, productTotal: state.products[addItemIndex].productTotal + 1};
                state.products[addItemIndex] = tempProduct;

            }
        },
        decreaseProduct: (state, action) => {
            let decreaseItemIndex = 0;
            //const itemIndex = state.products.findIndex((item)=>item.addIndex === action.payload.item.addIndex);

            state.products.forEach((item, index) => {
                if (item.addIndex === action.payload.addIndex) {
                    decreaseItemIndex = index;

                }
            });

            if (decreaseItemIndex >= 0) {
                if (state.products[decreaseItemIndex].productTotal > 0) {
                    state.totalQuantity--;
                    state.total -= action.payload.price;
                    const tempProduct = {
                        ...action.payload,
                        productTotal: state.products[decreaseItemIndex].productTotal - 1
                    };
                    state.products[decreaseItemIndex] = tempProduct;
                    if (state.products[decreaseItemIndex].productTotal === 0) {
                        if (confirm("Are you sure you want to delete the product?")) {
                            state.products.splice(decreaseItemIndex, 1);
                        } else {
                            state.totalQuantity++;
                            state.total += action.payload.price;
                            const tempProduct = {
                                ...action.payload,
                                productTotal: state.products[decreaseItemIndex].productTotal + 1
                            };
                            state.products[decreaseItemIndex] = tempProduct;
                        }

                    }
                }
            }

        },
        removeProduct: (state, action) => {
            let removeItemIndex = 0;
            state.products.forEach((item, index) => {
                if (item.addIndex === action.payload.addIndex) {
                    removeItemIndex = index;
                }
            });

            if (removeItemIndex >= 0) {
                if (state.totalQuantity >= 0) {

                    if (state.products[removeItemIndex].productTotal >= 0) {
                        if (confirm("Are you sure you want to delete the product?")) {

                            state.totalQuantity -= state.products[removeItemIndex].productTotal;
                            state.total -= state.products[removeItemIndex].price * state.products[removeItemIndex].productTotal;
                            state.products.splice(removeItemIndex, 1);
                            // state.products.filter((item) => item.addIndex !== action.payload.addIndex);
                        } else {
                            return;
                        }
                    }
                }
            }

        },


        reset: (state, action) => {
            state.products = [];
            state.total = 0;
            state.totalQuantity = 0;
        },
    }
});


export const cartActions = cartSlice.actions;
export default cartSlice.reducer;


//          let dependentSomeArray = false;
//             let allItemIndexArray = [];
//             let booleanProductVerification = [];
//
//             state.products.forEach((item, index) => {
//                 if (item._id === action.payload._id) {
//                     dependentSomeArray = true;
//                     allItemIndexArray.push({item, index});
//                 }
//             });
//
//             if (state.products.length === 0 || allItemIndexArray.length === 0) {
//                 const tempProduct = {...action.payload,status:0};
//                 state.totalQuantity++;
//                 state.total += +action.payload.price;
//                 state.products.push(tempProduct);
//             }
//             allItemIndexArray.filter((productIndex) => productIndex.item.extras.length === action.payload.extras.length)
//                 .map((productIndex) => {
//                     let productVerification = productIndex.item.extras.every((value, index) => value._id === action.payload.extras[index]._id);
//                     booleanProductVerification.push(productVerification);
//                     if (productVerification) {
//                         state.totalQuantity++;
//                         state.total += action.payload.price;
//                         state.products[productIndex.index].productTotal += 1;
//                         return;
//                     } else {
//                         return;
//                     }
//                 });
//             if (dependentSomeArray == true) {
//                 const booleanProductVerificationFilter = booleanProductVerification.some((currentValue) => currentValue === true);
//                 if (booleanProductVerificationFilter == false) {
//                     const tempProduct = {...action.payload,status:0};
//                     state.totalQuantity++;
//                     state.total += +action.payload.price;
//                     state.products.push(tempProduct);
//
//                 }
//             }