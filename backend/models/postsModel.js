import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    commentId: String,
    postId: mongoose.Schema.Types.ObjectId,
    name: String,
    comment: String,
    date: Date,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const postsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    dateUpdated: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    agency: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("Posts", postsSchema);

export default Posts;
