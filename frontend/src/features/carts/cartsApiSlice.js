//backend mutation
import { apiSlice } from "../api/apiSlice";
const CART_URL = "/api/carts";

export const cartsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFoodToCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/addFoodToCart`,
        method: "POST",
        body: data, // Ensure data is properly included in the request body
      }),
    }),

    getCart: builder.mutation({
      //get organizer FOOD
      query: () => ({
        url: `${CART_URL}`,
        method: "GET",
      }),
    }),

    getFood: builder.mutation({
      query: () => ({
        url: `${CART_URL}`,
        method: "GET",
      }),
    }),

    deleteFoodFromCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/removeFoodFromCart`,
        method: "PUT",
        body: data,
      }),
    }),
    EditFood: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}/EditFood`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${CART_URL}/upload-image`, // The endpoint for image upload
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useAddFoodToCartMutation,
  useGetCartMutation,
  useDeleteFoodFromCartMutation,
} = cartsApiSlice;
