import express from "express";
import { getAllPosts, SearchPost, createPost } from "../models/posts.js";

const router = express.Router();

router.get("/", (req, res) => {
  const posts = getAllPosts();
  res.status(200).json(posts);
});

router.get("/search/:searchTerm", (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    console.log("Received search request for term:", searchTerm);

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ error: "Search term is required" });
    }

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

router.get("/searchprueba", (req, res) => {
  const posts = Searchprueba();
  res.status(200).json(posts);
});

router.post("/", (req, res) => {
  const { subject, body, imageUrl, userId } = req.body;
  createPost(subject, body, imageUrl, userId);
  res.status(201).json({ message: "Post creado" });
});

export default router;
