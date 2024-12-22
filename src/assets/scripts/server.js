const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Database setup
const db = new sqlite3.Database("./src/assets/Database/users.db");

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (!user) return res.status(401).json({ success: false, message: "Invalid username or password" });

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { id: user.id, username: user.username };
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
      }
    });
  });
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  res.json({ success: true, user: req.session.user });
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});