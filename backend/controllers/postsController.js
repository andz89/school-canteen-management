import asyncHandler from "express-async-handler";

import Post from "../models/postsModel.js";

// @desc    add Post
// @route   POST /api/users/addpost
// @access  Private
const addPost = asyncHandler(async (req, res) => {
  if (!req.body.content || !req.body.title) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const posts = await Post.create({
    title: req.body.title,
    content: req.body.content,
    name: req.body.name,
    agency: req.body.agency,
    user: req.user._id,
    dateCreated: req.body.dateCreated,
    dateUpdated: req.body.dateUpdated,
  });

  res.json({ posts });
});
// @desc    Get organizer posts
// @route   GET /api/posts
// @access  Private
const getOrganizerPosts = asyncHandler(async (req, res) => {
  const post = await Post.find({ user: req.user._id });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Posts not found");
  }
});
const getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});
const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.body.postId);

  const commentData = {
    commentId: req.body.commentId,
    postId: req.body.postId,
    name: req.body.name,
    comment: req.body.comment,
    date: req.body.date,
    userId: req.user._id,
  };
  if (post) {
    post.comments.push(commentData);

    await post.save();

    res.json({
      comment: commentData,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const removePost = asyncHandler(async (req, res) => {
  const postId = req.body.postId;

  try {
    // Use async/await with findByIdAndRemove to ensure proper handling of asynchronous code.
    const result = await Post.findById(postId);

    if (result.user.toString() === req.user._id.toString()) {
      const removedPost = await Post.findByIdAndRemove(postId);
      // Check if the post was found and removed successfully.
      if (!removedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post removed successfully" });
    } else {
      res.json({ message: "You are not the owner of this post!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const removeComment = asyncHandler(async (req, res) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;

  try {
    // Use async/await with findByIdAndRemove to ensure proper handling of asynchronous code.
    const post = await Post.findById(postId);
    // Check if the post was found and removed successfully.
    if (!post) {
      return res.status(404).json({ message: "comment not found" });
    }

    //if the owner use delete function
    if (post.user.toString() === req.user._id.toString()) {
      console.log("nathc");
      const new_comment = post.comments.filter((comment) => {
        return comment.commentId !== commentId;
      });

      post.comments = new_comment;
      await post.save();
      res.json({ message: "Post removed successfully" });
    } else {
      //get the comment fron the post
      const result = post.comments.filter((comment) => {
        return comment.commentId === commentId;
      });

      // check the owner of the comment
      if (result[0].userId.toString() === req.user._id.toString()) {
        const new_comment = post.comments.filter((comment) => {
          return comment.commentId !== commentId;
        });

        post.comments = new_comment;
        await post.save();
        res.json({ message: "Post removed successfully" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const editPost = asyncHandler(async (req, res) => {
  const postId = req.body.postId;

  try {
    // Use async/await with findById to ensure proper handling of asynchronous code.
    const post = await Post.findById(postId);

    // Check if the post was found.
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post's properties based on the request body data.
    post.title = req.body.title;
    post.content = req.body.content;
    post.name = req.body.name;
    post.agency = req.body.agency;
    post.dateUpdated = req.body.dateUpdated;
    // Save the updated post.
    await post.save();

    res.json(post.dateUpdated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  addPost,
  getOrganizerPosts,
  addComment,
  removePost,
  removeComment,
  editPost,
  getPublicPosts,
};
