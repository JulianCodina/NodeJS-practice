import express from "express";
import { getAllReplies, createReply } from "../models/replies.js";

const router = express.Router();

router.get("/:postId", (req, res) => {
  const replies = getAllReplies(req.params.postId);
  res.status(200).json(replies);
});

router.post("/:postId", (req, res) => {
  const { body, userId } = req.body;
  createReply(req.params.postId, body, userId);
  res.status(201).json({ message: "Reply creado" });
});

export default router;
