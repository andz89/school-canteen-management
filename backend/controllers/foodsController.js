import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Food from "../models/foodsModel.js";
import { deleteImage } from "../helper/deleteImage.js";
// @desc    add Post
// @route   POST /api/users/addpost
// @access  Private

const addFood = asyncHandler(async (req, res) => {
  let image_one;
  let image_two;

  req.files.image_one.forEach((e) => {
    image_one = e.filename;
  });

  req.files.image_two.forEach((e) => {
    image_two = e.filename;
  });

  req.body.image_two = image_two;
  req.body.image_one = image_one;
  console.log(req.body);
  if (!req.body.food_name || !req.body.price || !req.body.description) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const food = await Food.create({
    food_name: req.body.food_name,
    price: req.body.price,
    description: req.body.description,
    image_one: req.body.image_one,
    image_two: req.body.image_two,
  });
  food.image_one = process.env.DOMAIN + food.image_one;
  food.image_two = process.env.DOMAIN + food.image_two;
  res.json({ food });
});
// @desc    Get organizer posts
// @route   GET /api/posts
// @access  Private
const getFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find();
  foods.image_one = process.env.DOMAIN + foods.image_one;
  foods.image_two = process.env.DOMAIN + foods.image_two;

  if (foods) {
    res.json(foods);
  } else {
    res.status(404);
    throw new Error("foods not found");
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

const removeFood = asyncHandler(async (req, res) => {
  const foodId = req.body.foodId;

  // const food = await Food.findById(foodId);

  // let arrayImgs = [food.image_one, food.image_two];

  // await deleteImage(arrayImgs)
  try {
    // Use async/await with findByIdAndRemove to ensure proper handling of asynchronous code.
    const removedPost = await Food.findByIdAndRemove(foodId);
    // Check if the post was found   and removed successfully.
    if (!removedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post removed successfully" });
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

export { addFood, getFoods, removeFood };
