import express from "express";
import {
  addPost,
  getOrganizerPosts,
  addComment,
  removePost,
  removeComment,
  editPost,
  getPublicPosts,
} from "../controllers/postsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addPost", protect, addPost);
router.put("/addComment", protect, addComment);
router.put("/removePost", protect, removePost);
router.put("/removeComment", protect, removeComment);
router.put("/editPost", protect, editPost);

router.route("/").get(protect, getOrganizerPosts);
router.route("/publicPosts").get(protect, getPublicPosts);

export default router;
