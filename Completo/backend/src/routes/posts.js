import express from "express";
import {
  getAllPosts,
  getAllPostsById,
  SearchPost,
  createPost,
  createManyPost,
  deletePost,
} from "../models/posts.js";

const router = express.Router();

router.get("/", (req, res) => {
  const posts = getAllPosts();
  res.status(200).json(posts);
});

router.get("/user/:user_id", (req, res) => {
  const posts = getAllPostsById(req.params.user_id);
  res.status(200).json(posts);
});

router.get("/:searchTerm", (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;

    const posts = SearchPost(searchTerm);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Error performing search",
      details: error.message,
    });
  }
});

router.post("/", (req, res) => {
  try {
    const { user_id, subject, content, image_url } = req.body;

    if (!user_id || !subject || !content) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    const postId = createPost(user_id, subject, content, image_url);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      postId: postId,
    });
  } catch (error) {
    console.error("Error in POST /posts:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create post",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.post("/many", (req, res) => {
  try {
    const posts = req.body;

    const results = createManyPost(posts);

    return res.status(201).json({
      success: true,
      message: `Successfully created all ${results.length} posts`,
      results,
    });
  } catch (error) {
    console.error("Error in POST /posts/many:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process posts",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  deletePost(id);
  res.status(204).json({ message: "Post eliminado" });
});

export default router;
