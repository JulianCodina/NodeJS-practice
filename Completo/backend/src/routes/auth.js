import express from "express";
import { getUserById } from "../models/users.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  res.status(200).json(user);
});

router.get("/username/:username", (req, res) => {
  const user = getUserByUsername(req.params.username);
  res.status(200).json(user);
});

export default router;
