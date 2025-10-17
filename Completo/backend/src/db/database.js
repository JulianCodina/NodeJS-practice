import Database from "better-sqlite3";
const db = new Database("./src/db/holonet.db", { verbose: console.log });
export default db;
