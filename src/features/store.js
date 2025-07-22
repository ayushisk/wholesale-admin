import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

import authReducer from "../features/slices/authSlice";
import categoryReducer from "../features/slices/categorySlice";
import productReducer from "../features/slices/productSlice";
import orderReducer from "../features/slices/orderSlice";

const persistConfig = {
  key: "Wholesale_Admin",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: `${import.meta.env.VITE_REDUX_PERSIST_SECRET_KEY}`,
      onError: (err) => {
        console.log("Redux Persist Encryption Failed: ", err);
      },
    }),
  ],
};

const reducer = combineReducers({
  // partners: partnersReducer,
  auth: authReducer,
  categories: categoryReducer,
  products: productReducer,
  order: orderReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_WORKING_ENVIRONMENT !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
