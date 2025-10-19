import db from "../db/database.js";

export function getAllReplies(post_id) {
  return db
    .prepare(
      `
    SELECT r.*, u.id AS user_id, u.username AS username, (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id) AS likes
    FROM replies r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.post_id = ?
    ORDER BY r.created_at DESC
  `
    )
    .all(post_id);
}

export function createReply(post_id, content, user_id) {
  try {
    const query = db.prepare(
      "INSERT INTO replies (post_id, content, user_id) VALUES (?, ?, ?)"
    );
    const info = query.run(post_id, content, user_id);

    return info.lastInsertRowid;
  } catch (error) {
    console.error("Error in createPost:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}

export function createManyReply(replies) {
  const results = [];

  for (const reply of replies) {
    try {
      const { post_id, content, user_id } = reply;

      const replyId = createReply(post_id, content, user_id);
      results.push({ success: true, replyId });
    } catch (error) {
      console.error("Error creating reply:", error);
      results.push({
        success: false,
        error: error.message,
        reply: reply,
      });
    }
  }
  return results;
}
