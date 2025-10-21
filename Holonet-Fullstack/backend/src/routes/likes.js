import express from "express";
import { getLikesByUserId, addLike, removeLike } from "../models/likes.js";

const router = express.Router();

router.get("/:user_id", (req, res) => {
  const posts = getLikesByUserId(req.params.user_id);
  res.status(200).json(posts);
});
router.get("/:user_id/:post_id", (req, res) => {
  const posts = getLikesByUserId(req.params.user_id, req.params.post_id);
  res.status(200).json(posts);
});

router.post("/", (req, res) => {
  const { post_id, user_id, reply_id } = req.body;
  if (!reply_id) {
    const likes = getLikesByUserId(user_id);
    if (likes.some((like) => like.post_id === post_id)) {
      removeLike(post_id, user_id);
      res.status(200).json({ message: "Like removed" });
    } else {
      addLike(post_id, user_id);
      res.status(200).json({ message: "Like added" });
    }
  } else {
    const likes = getLikesByUserId(user_id, post_id);
    if (likes.some((like) => like.reply_id === reply_id)) {
      removeLike(post_id, user_id, reply_id);
      res.status(200).json({ message: "Like reply removed" });
    } else {
      addLike(post_id, user_id, reply_id);
      res.status(200).json({ message: "Like reply added" });
    }
  }
});

export default router;
