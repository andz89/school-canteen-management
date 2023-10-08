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

  if (foods) {
    foods.forEach((element) => {
      element.image_one = process.env.DOMAIN + element.image_one;
      element.image_two = process.env.DOMAIN + element.image_two;
    });
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

  const food = await Food.findById(foodId);

  let arrayImgs = [food.image_one, food.image_two];

  await deleteImage(arrayImgs);
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
const editFood = asyncHandler(async (req, res) => {
  const foodId = req.body.foodId;

  try {
    // Use async/await with findById to ensure proper handling of asynchronous code.
    const food = await Food.findById(foodId);

    // Check if the post was found.
    if (!food) {
      return res.status(404).json({ message: "item food not found" });
    }

    req.files.image_one &&
      req.files.image_one.forEach(async (e) => {
        let arrayImgs = [food.image_one];

        await deleteImage(arrayImgs);
        food.image_one = e.filename;
      });

    req.files.image_two &&
      req.files.image_two.forEach(async (e) => {
        let arrayImgs = [food.image_two];

        await deleteImage(arrayImgs);
        food.image_two = e.filename;
      });

    // Update the food's properties based on the request body data.
    food.food_name = req.body.food_name;
    food.price = req.body.price;

    food.description = req.body.description;

    // Save the updated foods.
    await food.save();
    // food.image_one = process.env.DOMAIN + "/" + food.image_one;
    // food.image_two = process.env.DOMAIN + "/" + food.image_two;
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { addFood, getFoods, removeFood, editFood };
