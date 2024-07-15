// controllers/memesController.js
const db = require("../db");

// Obtener todos los memes
exports.getAllMemes = (req, res) => {
  const query = "SELECT * FROM memes";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
};

// Crear un nuevo meme
exports.createMeme = (req, res) => {
  const { url, title, description, rating, author } = req.body;
  const query =
    "INSERT INTO memes (url, title, description, rating, author) VALUES (?, ?, ?, ?, ?)";
  const values = [url, title, description, rating, author];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};
