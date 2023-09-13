//local mutation
import { createSlice } from "@reduxjs/toolkit";
import { sub } from "date-fns";
const initialState = {
  foods: [],
};

const foodsSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {
    foodAdded: {
      reducer(state, action) {
        state.foods.push(action.payload);
      },
      prepare({ food_name, price, description }) {
        return {
          payload: {
            food_name,
            price,
            description,
          },
        };
      },
    },
    foodsFetched: (state, action) => {
      // Update the state with the posts received from the server
      state.posts = action.payload;
    },

    foodsEditted: (state, action) => {
      const { postId, title, content, dateUpdated } = action.payload;
      const existingPost = state.posts.find((post) => post._id === postId);

      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.dateUpdated = dateUpdated;
      }
    },
    removeFood: (state, action) => {
      const { postId } = action.payload;
      const posts = state.posts.filter((post) => post._id !== postId);

      if (posts) {
        state.posts = posts;
      }
    },
  },
});

export const {
  foodAdded,

  foodsFetched,
  removefood,

  postEditted,
} = foodsSlice.actions;

export default foodsSlice.reducer;
