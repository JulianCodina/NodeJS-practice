import db from "../db/database.js";

export function getAllPosts() {
  return db
    .prepare(
      `
    SELECT p.*, u.username AS author
    FROM posts p
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `
    )
    .all();
}

export function SearchPost(searchTerm) {
  try {
    const query = db.prepare(`
      SELECT *
      FROM posts
      WHERE subject LIKE ?
      ORDER BY created_at DESC
    `);

    const searchValue = `%${searchTerm}%`;
    console.log("Executing search with term:", searchValue);

    const result = query.all(searchValue);
    console.log("Search results:", result.length, "posts found");

    return result;
  } catch (error) {
    console.error("Error in SearchPost:", error.message);
    console.error("Search term was:", searchTerm);
    throw error;
  }
}

export function Searchprueba() {
  const query = db.prepare("SELECT * FROM posts WHERE subject LIKE '%prueba%'");
  const result = query.all();
  console.log("Search results:", result.length, "posts found");
  return result;
}

export function createPost(subject, body, imageUrl, userId) {
  const query = db.prepare(
    "INSERT INTO posts (subject, body, image_url, user_id) VALUES (?, ?, ?, ?)"
  );
  const info = query.run(subject, body, imageUrl, userId);
  return info.lastInsertRowid;
}
