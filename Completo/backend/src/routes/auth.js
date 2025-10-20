import express from "express";
import {
  getUserById,
  getUserByUsername,
  createUser,
  changeName,
  changePassword,
  deleteUser,
} from "../models/users.js";
import crypto from "crypto";

const router = express.Router();

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  res.status(200).json(user);
});

router.delete("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  deleteUser(user.id);
  res.status(200).json(user);
});

router.patch("/:id/:type/:value", (req, res) => {
  const { id, type, value } = req.params;
  const user = getUserById(id);
  if (!user) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }
  if (type === "username") {
    changeName(user.id, value);
  } else if (type === "password") {
    const password_hash = crypto
      .createHash("sha256")
      .update(value)
      .digest("hex");
    changePassword(user.id, password_hash);
  }
  res.status(200).json(user);
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = getUserByUsername(username);
  if (!user) {
    return res.status(401).json({
      error: "Usuario no encontrado",
    });
  }
  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  if (user.password_hash !== password_hash) {
    return res.status(401).json({
      error: "Contraseña incorrecta",
    });
  }
  res.status(200).json(user);
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const user = createUser(username, password_hash);
  res.status(200).json(user);
});

export default router;
