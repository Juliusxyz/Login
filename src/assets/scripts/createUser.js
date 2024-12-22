const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("D:/Dev/Login/src/assets/Database/users.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  const username = "admin"; // Beispielbenutzer
  const password = "password123"; // Beispielpasswort

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Fehler beim Hashing:", err);
      return;
    }

    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hash],
      (err) => {
        if (err) {
          console.error("Fehler beim Einfügen:", err);
        } else {
          console.log("Benutzer erfolgreich erstellt!");
        }
        db.close();
      }
    );
  });
});