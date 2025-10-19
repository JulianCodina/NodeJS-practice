import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import db from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testDatabase() {
  try {
    console.log("=== Probando consultas a la base de datos ===");
    console.log("\n1. Creando tablas...");
    const initSql = readFileSync(join(__dirname, "init.sql"), "utf-8");
    db.exec(initSql);
    console.log("✅ Tablas creadas correctamente");
    //
    //
    //
    console.log("\n2. Insertando usuarios...");
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(
      "Admin",
      "hash123"
    );
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(
      "Julian",
      "hash123"
    );
    console.log("✅ Usuarios insertados");
    //
    //
    /*
    console.log("\n3. Insertando post...");
    db.prepare(
      "INSERT INTO posts (subject, body, user_id) VALUES (?, ?, ?)"
    ).run("Título de prueba", "Contenido de prueba", 1);
    console.log("✅ Post insertado");

    console.log("\n3. Insertando otro post...");
    db.prepare(
      "INSERT INTO posts (subject, body, user_id) VALUES (?, ?, ?)"
    ).run("prueba 2", "Contenido de prueba 2", 1);
    console.log("✅ Otro post insertado");
    //
    //
    console.log("\n4. Consultando posts...");
    const posts = db.prepare("SELECT * FROM posts").all();
    console.log("📝 Posts encontrados:");
    console.table(posts);*/
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    db.close();
  }
}

testDatabase();
