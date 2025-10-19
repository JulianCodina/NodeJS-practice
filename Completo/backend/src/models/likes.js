import db from "../db/database.js";

export function getLikesByUserId(user_id, post_id = null) {
  if (!post_id) {
    return db
      .prepare(
        `
            SELECT id, post_id
            FROM post_likes
            WHERE user_id = ?
            `
      )
      .all(user_id);
  } else {
    return db
      .prepare(
        `
            SELECT id, reply_id, post_id
            FROM reply_likes
            WHERE post_id = ? AND user_id = ?
            `
      )
      .all(post_id, user_id);
  }
}

export function addLike(post_id, user_id, reply_id = null) {
  if (!reply_id) {
    return db
      .prepare(
        `
            INSERT INTO post_likes (post_id,user_id)
            VALUES (?, ?)
            `
      )
      .run(post_id, user_id);
  } else {
    return db
      .prepare(
        `
            INSERT INTO reply_likes (post_id, user_id, reply_id)
            VALUES (?, ?, ?)
            `
      )
      .run(post_id, user_id, reply_id);
  }
}

export function removeLike(post_id, user_id, reply_id = null) {
  if (!reply_id) {
    return db
      .prepare(
        `
            DELETE FROM post_likes
            WHERE post_id = ? AND user_id = ?
            `
      )
      .run(post_id, user_id);
  } else {
    return db
      .prepare(
        `
            DELETE FROM reply_likes
            WHERE post_id = ? AND user_id = ? AND reply_id = ?
            `
      )
      .run(post_id, user_id, reply_id);
  }
}
