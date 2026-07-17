const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { RecommendationEngine, tokenize } = require("./lib/recommend");

const app = express();
const PORT = process.env.PORT || 5000;

const MOVIES_PATH = path.join(__dirname, "data", "movies.json");
const RATINGS_PATH = path.join(__dirname, "data", "ratings.json");
const USERS_PATH = path.join(__dirname, "data", "users.json");

app.use(cors());
app.use(express.json());

// --- tiny JSON "database" helpers -----------------------------------
function readJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
if (!fs.existsSync(RATINGS_PATH)) writeJSON(RATINGS_PATH, []);
if (!fs.existsSync(USERS_PATH)) writeJSON(USERS_PATH, []);

const movies = readJSON(MOVIES_PATH, []);
const engine = new RecommendationEngine(movies);

// --- Movies -----------------------------------------------------------
app.get("/api/movies", (req, res) => {
  const { year, genre, search } = req.query;
  let result = movies;

  if (year) {
    const [start, end] = year.split("-").map(Number);
    result = result.filter((m) => m.year >= start && m.year <= (end || start));
  }
  if (genre) {
    result = result.filter((m) =>
      m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.characters.some((c) => c.toLowerCase().includes(q))
    );
  }
  res.json(result);
});

app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  const similar = engine.similarTo(movie.id, 4);
  res.json({ ...movie, similar });
});

app.get("/api/genres", (req, res) => {
  const genres = [...new Set(movies.flatMap((m) => m.genres))].sort();
  res.json(genres);
});

// --- AI Recommendation -------------------------------------------------
app.post("/api/recommend", (req, res) => {
  const { genres = [], character = "", mood = "", freeText = "" } = req.body || {};
  const results = engine.recommend({ genres, character, mood, freeText }, 5);
  res.json(results);
});

// --- AI Chat Assistant (keyword + TF-IDF backed) ------------------------
app.post("/api/chat", (req, res) => {
  const { message = "" } = req.body || {};
  if (!message.trim()) {
    return res.json({
      reply:
        "Tell me what kind of Barbie movie mood you're in \u2014 magical, musical, sporty, sisterly \u2014 and I'll find a match!",
      movies: [],
    });
  }

  const results = engine.recommend({ freeText: message }, 3);
  const top = results[0];

  let reply;
  if (!top || top.matchScore === 0) {
    reply =
      "I couldn't find a strong match for that \u2014 try mentioning a genre (like fantasy or music), a character, or a mood.";
  } else {
    reply = `Based on "${message}", I'd recommend ${top.title} (${top.year}). ${top.reason}`;
  }

  res.json({ reply, movies: results });
});

// --- Ratings & Favorites -------------------------------------------------
app.get("/api/ratings/:userId", (req, res) => {
  const ratings = readJSON(RATINGS_PATH, []);
  res.json(ratings.filter((r) => r.userId === req.params.userId));
});

app.post("/api/ratings", (req, res) => {
  const { userId, movieId, rating, favorite } = req.body || {};
  if (!userId || !movieId) {
    return res.status(400).json({ error: "userId and movieId are required" });
  }
  const ratings = readJSON(RATINGS_PATH, []);
  const existingIdx = ratings.findIndex(
    (r) => r.userId === userId && r.movieId === movieId
  );
  const entry = {
    userId,
    movieId,
    rating: rating ?? ratings[existingIdx]?.rating ?? null,
    favorite: favorite ?? ratings[existingIdx]?.favorite ?? false,
    updatedAt: new Date().toISOString(),
  };
  if (existingIdx >= 0) {
    ratings[existingIdx] = entry;
  } else {
    ratings.push(entry);
  }
  writeJSON(RATINGS_PATH, ratings);
  res.json(entry);
});

// --- Simple user "auth" (demo-only, no real security) --------------------
app.post("/api/users/register", (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const users = readJSON(USERS_PATH, []);
  let user = users.find((u) => u.email === email);
  if (!user) {
    user = { id: `u${users.length + 1}`, name, email };
    users.push(user);
    writeJSON(USERS_PATH, users);
  }
  res.json(user);
});

app.get("/api/health", (req, res) => res.json({ status: "ok", movies: movies.length }));

app.listen(PORT, () => {
  console.log(`🎀 Barbie Movie API running at http://localhost:${PORT}`);
});
