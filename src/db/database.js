const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DB_PATH;

const resolvedPath = path.resolve(dbPath);

// Crear conexión
const db = new sqlite3.Database(resolvedPath, (err) => {
    if (err) {
        console.error("[DB] Error connecting to SQLite:", err.message);
    } else {
        console.log("[DB] Connected to SQLite database");
    }
});

const initializeDatabase = () => {
    db.serialize(() => {
        db.run(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      template_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    });

    console.log("[DB] Database initialized");
};

module.exports = {
    db,
    initializeDatabase,
};
