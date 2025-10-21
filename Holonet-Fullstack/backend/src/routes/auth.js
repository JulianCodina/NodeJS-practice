import express from "express";
import session from "express-session";
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

router.use(
  session({
    secret: "tu_secreto_seguro",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
};

router.get("/me", requireAuth, (req, res) => {
  const user = getUserById(req.session.userId);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const { password_hash, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
});

router.get("/:id", requireAuth, (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const { password_hash, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  });
});

router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== parseInt(req.session.userId)) {
    return res.status(403).json({
      error: "No autorizado para realizar esta acción",
      detail: "Solo puedes modificar tu propia información de usuario",
    });
  }

  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  deleteUser(user.id);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al destruir sesión:", err);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  });
});

// Actualizar datos del usuario
router.patch("/:id/:type/:value", requireAuth, (req, res) => {
  const { id, type, value } = req.params;

  if (parseInt(id) !== parseInt(req.session.userId)) {
    return res.status(403).json({
      error: "No autorizado para realizar esta acción",
      detail: "Solo puedes modificar tu propia información de usuario",
    });
  }

  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  try {
    if (type === "username") {
      changeName(user.id, value);
      req.session.username = value;
    } else if (type === "password") {
      const password_hash = crypto
        .createHash("sha256")
        .update(value)
        .digest("hex");
      changePassword(user.id, password_hash);
    } else {
      return res.status(400).json({
        error: "Tipo de actualización no válido",
        validTypes: ["username", "password"],
      });
    }
    const updatedUser = getUserById(id);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      error: "Error al actualizar el usuario",
      detail: error.message,
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son requeridos" });
  }
  const user = getUserByUsername(username);
  if (!user) {
    return res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  }
  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  if (user.password_hash !== password_hash) {
    return res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  const { password_hash: _, ...userWithoutPassword } = user;

  res.status(200).json({
    message: "Inicio de sesión exitoso",
    user: userWithoutPassword,
  });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son requeridos" });
  }
  const existingUser = getUserByUsername(username);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "El nombre de usuario ya está en uso" });
  }
  try {
    const password_hash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const user = createUser(username, password_hash);
    req.session.userId = user.id;
    req.session.username = user.username;
    const { password_hash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

export default router;
