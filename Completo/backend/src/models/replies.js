import db from "../db/database.js";

export function getAllReplies(postId) {
  return db
    .prepare(
      `
    SELECT *
    FROM replies 
    WHERE post_id = ?
    ORDER BY created_at DESC
  `
    )
    .all(postId);
}

export function createReply(postId, body, userId) {
  const query = db.prepare(
    "INSERT INTO replies (post_id, body, user_id) VALUES (?, ?, ?)"
  );
  const info = query.run(postId, body, userId);
  return info.lastInsertRowid;
}
