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

export function createReply(post_id, content, user_id, created_at) {
  try {
    const query = created_at
      ? db.prepare(
          "INSERT INTO replies (post_id, content, user_id, created_at) VALUES (?, ?, ?, ?)"
        )
      : db.prepare(
          "INSERT INTO replies (post_id, content, user_id) VALUES (?, ?, ?)"
        );
    
    const params = created_at 
      ? [post_id, content, user_id, created_at]
      : [post_id, content, user_id];
      
    const info = query.run(...params);
    return info.lastInsertRowid;
  } catch (error) {
    console.error("Error in createReply:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}

export function createManyReply(replies) {
  const results = [];

  for (const reply of replies) {
    try {
      const { post_id, content, user_id, created_at } = reply;

      const replyId = createReply(post_id, content, user_id, created_at);
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

export function deleteReply(id) {
  try {
    const query = db.prepare("DELETE FROM replies WHERE id = ?");
    const info = query.run(id);
    return info.changes;
  } catch (error) {
    console.error("Error in deletePost:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}
