import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import cartSlice from "./cartSlice";
import cartIndex from "./cartIndex";
import ProductExtras from "./ProductExtras";
import FavoriteProducts from "./FavoriteProducts"
import userInfo from "./userInfo"
const persistConfig = {
    key: 'root',
    version:1,
    storage,
}
const reducer = combineReducers({
    cart:cartSlice,
    cartIndex:cartIndex,
    productExtras:ProductExtras,
    favoriteProducts:FavoriteProducts,
    userInfo:userInfo
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store=  configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);
export default store;

