import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authUser/authSlice";

import { apiSlice } from "../features/api/apiSlice";

import foodsReducer from "../features/foods/foodsSlice";
import cartsReducer from "../features/carts/cartsSlice";
import ordersReducer from "../features/orders/ordersSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    foods: foodsReducer,
    carts: cartsReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
