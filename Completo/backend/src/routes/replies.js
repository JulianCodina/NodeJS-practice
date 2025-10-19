import express from "express";
import {
  getAllReplies,
  createReply,
  createManyReply,
  deleteReply,
} from "../models/replies.js";

const router = express.Router();

router.get("/:post_id", (req, res) => {
  const replies = getAllReplies(req.params.post_id);
  res.status(200).json(replies);
});

router.post("/", (req, res) => {
  try {
    const { post_id, content, user_id } = req.body;

    const results = createReply(post_id, content, user_id);

    res.status(201).json({
      success: true,
      message: "Reply created",
      results,
    });
  } catch (error) {
    console.error("Error in POST /replies:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create reply",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.post("/many", (req, res) => {
  try {
    const replies = req.body;

    if (!Array.isArray(replies)) {
      return res.status(400).json({
        success: false,
        error: "Expected an array of replies in the request body",
      });
    }

    const results = createManyReply(replies);

    return res.status(201).json({
      success: true,
      message: `Successfully created ${results.length} replies`,
      results,
    });
  } catch (error) {
    console.error("Error in POST /replies/many:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process replies",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteReply(id);
    res.status(200).json({
      success: true,
      message: "Reply deleted",
      result,
    });
  } catch (error) {
    console.error("Error in DELETE /replies/:id:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete reply",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;
