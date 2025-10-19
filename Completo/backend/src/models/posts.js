import db from "../db/database.js";

export function getAllPosts() {
  return db
    .prepare(
      `
    SELECT p.*, u.id AS userId, u.username AS username,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
      (SELECT COUNT(*) FROM replies WHERE post_id = p.id) AS replies
    FROM posts p
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `
    )
    .all();
}

export function getAllPostsById(user_id) {
  return db
    .prepare(
      `
    SELECT p.*, u.id AS userId, u.username AS username,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
      (SELECT COUNT(*) FROM replies WHERE post_id = p.id) AS replies
    FROM posts p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `
    )
    .all(user_id);
}

export function SearchPost(searchTerm) {
  try {
    const query = db.prepare(
      `
    SELECT p.*, u.id AS userId, u.username AS username,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
      (SELECT COUNT(*) FROM replies WHERE post_id = p.id) AS replies
    FROM posts p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE subject LIKE ?
    ORDER BY p.created_at DESC
  `
    );

    const searchValue = `%${searchTerm}%`;
    const result = query.all(searchValue);

    return result;
  } catch (error) {
    console.error("Error in SearchPost:", error.message);
    console.error("Search term was:", searchTerm);
    throw error;
  }
}

export function createPost(user_id, subject, content, image_url) {
  try {
    const query = db.prepare(
      "INSERT INTO posts (user_id, subject, content, image_url) VALUES (?, ?, ?, ?)"
    );
    const info = query.run(user_id, subject, content, image_url || null);

    return info.lastInsertRowid;
  } catch (error) {
    console.error("Error in createPost:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}

export function createManyPost(posts) {
  const results = [];

  for (const post of posts) {
    try {
      const { user_id, subject, content, image_url } = post;

      const postId = createPost(user_id, subject, content, image_url || null);
      results.push({ success: true, postId });
    } catch (error) {
      console.error("Error creating post:", error);
      results.push({
        success: false,
        error: error.message,
        post: post,
      });
    }
  }
  return results;
}

export function deletePost(id) {
  const query = db.prepare("DELETE FROM posts WHERE id = ?");
  const info = query.run(id);
  return info.changes;
}
