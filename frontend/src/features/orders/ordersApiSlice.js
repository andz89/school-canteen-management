//backend mutation
import { apiSlice } from "../api/apiSlice";
const ORDER_URL = "/api/orders";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setNewOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/setNewOrder`,
        method: "POST",
        body: data, // Ensure data is properly included in the request body
      }),
    }),

    getOrders: builder.mutation({
      //get organizer FOOD
      query: () => ({
        url: `${ORDER_URL}`,
        method: "GET",
      }),
    }),

    getFood: builder.mutation({
      query: () => ({
        url: `${ORDER_URL}`,
        method: "GET",
      }),
    }),

    deleteFoodFromCart: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/removeFoodFromCart`,
        method: "PUT",
        body: data,
      }),
    }),

    EditFood: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/EditFood`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${ORDER_URL}/upload-image`, // The endpoint for image upload
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSetNewOrderMutation, useGetOrdersMutation } = ordersApiSlice;
