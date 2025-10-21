import db from "../db/database.js";

export function getUserById(userId) {
  return db
    .prepare(
      `
    SELECT id, username, password_hash, created_at
    FROM users 
    WHERE id = ?
    ORDER BY created_at DESC
  `
    )
    .get(userId);
}
export function getUserByUsername(username) {
  return db
    .prepare(
      `
    SELECT id, username, password_hash, created_at
    FROM users 
    WHERE username = ?
    ORDER BY created_at DESC
  `
    )
    .get(username);
}

export function changeName(userId, username) {
  return db
    .prepare(
      `
    UPDATE users 
    SET username = ?
    WHERE id = ?
    `
    )
    .run(username, userId);
}

export function changePassword(userId, password) {
  return db
    .prepare(
      `
    UPDATE users 
    SET password_hash = ?
    WHERE id = ?
    `
    )
    .run(password, userId);
}

export function createUser(username, password) {
  const query = db.prepare(
    `
    INSERT INTO users (username, password_hash) VALUES (?, ?)
    `
  );
  const info = query.run(username, password);
  return info.lastInsertRowid;
}

export function deleteUser(userId) {
  return db
    .prepare(
      `
    DELETE FROM users 
    WHERE id = ?
    `
    )
    .run(userId);
}
