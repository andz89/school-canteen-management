//backend mutation
import { apiSlice } from "../api/apiSlice";
const POST_URL = "/api/posts";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/addPost`,
        method: "POST",
        body: { ...data }, // Ensure data is properly included in the request body
      }),
    }),
    getPost: builder.mutation({
      //get organizer post
      query: () => ({
        url: `${POST_URL}`,
        method: "GET",
      }),
    }),

    getOrganizerPost: builder.mutation({
      query: () => ({
        url: `${POST_URL}`,
        method: "GET",
      }),
    }),
    addComment: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/addComment`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/removePost`,
        method: "PUT",
        body: data,
      }),
    }),
    EditPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/EditPost`,
        method: "PUT",
        body: { ...data },
      }),
    }),
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/removeComment`,
        method: "PUT",
        body: data,
      }),
    }),
    getPublicPost: builder.mutation({
      //get all posts of organizers
      query: () => ({
        url: `${POST_URL}/publicPosts`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddPostMutation,
  useGetPostMutation,
  useAddCommentMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
  useEditPostMutation,
  useGetPublicPostMutation,
} = usersApiSlice;
