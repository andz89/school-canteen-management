import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authUser/authSlice";

import { apiSlice } from "../features/api/apiSlice";

// import postsReducer from "../features/posts/postsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
    // posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
