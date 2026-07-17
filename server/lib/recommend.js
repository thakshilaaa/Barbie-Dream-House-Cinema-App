/**
 * Lightweight content-based recommendation engine.
 * Builds a TF-IDF vector per movie from its genres, mood tags,
 * characters and summary, then ranks movies against a user's
 * free-text / tag-based preferences using cosine similarity.
 * No external ML dependencies required.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "with", "her",
  "she", "his", "he", "it", "is", "are", "was", "for", "who", "must",
  "their", "them", "they", "into", "that", "this", "has", "have", "as",
  "i", "want", "like", "movie", "movies", "about"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

function movieToDocument(movie) {
  const parts = [
    ...movie.genres,
    ...movie.mood,
    ...movie.characters,
    movie.summary,
    movie.title,
  ];
  return tokenize(parts.join(" "));
}

function buildVocabulary(documents) {
  const vocab = new Map();
  let idx = 0;
  for (const doc of documents) {
    for (const term of doc) {
      if (!vocab.has(term)) {
        vocab.set(term, idx++);
      }
    }
  }
  return vocab;
}

function termFrequency(doc) {
  const tf = new Map();
  for (const term of doc) {
    tf.set(term, (tf.get(term) || 0) + 1);
  }
  const max = Math.max(...tf.values(), 1);
  for (const [term, count] of tf) {
    tf.set(term, count / max);
  }
  return tf;
}

function inverseDocumentFrequency(documents, vocab) {
  const idf = new Map();
  const n = documents.length;
  for (const term of vocab.keys()) {
    const containing = documents.filter((doc) => doc.includes(term)).length;
    idf.set(term, Math.log((n + 1) / (containing + 1)) + 1);
  }
  return idf;
}

function vectorize(tf, idf, vocab) {
  const vec = new Array(vocab.size).fill(0);
  for (const [term, freq] of tf) {
    if (vocab.has(term)) {
      vec[vocab.get(term)] = freq * idf.get(term);
    }
  }
  return vec;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

class RecommendationEngine {
  constructor(movies) {
    this.movies = movies;
    this.documents = movies.map(movieToDocument);
    this.vocab = buildVocabulary(this.documents);
    this.idf = inverseDocumentFrequency(this.documents, this.vocab);
    this.movieVectors = this.documents.map((doc) =>
      vectorize(termFrequency(doc), this.idf, this.vocab)
    );
  }

  /**
   * prefs: { genres: string[], character: string, mood: string, freeText: string }
   */
  recommend(prefs, topN = 5) {
    const queryText = [
      ...(prefs.genres || []),
      prefs.character || "",
      prefs.mood || "",
      prefs.freeText || "",
    ]
      .join(" ")
      .trim();

    const queryDoc = tokenize(queryText);
    const queryVec = vectorize(termFrequency(queryDoc), this.idf, this.vocab);

    const scored = this.movies.map((movie, i) => {
      const score = cosineSimilarity(queryVec, this.movieVectors[i]);
      return { movie, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topN).map(({ movie, score }) => ({
      ...movie,
      matchScore: Math.round(score * 100),
      reason: this._explain(movie, prefs),
    }));
  }

  similarTo(movieId, topN = 4) {
    const idx = this.movies.findIndex((m) => m.id === movieId);
    if (idx === -1) return [];
    const target = this.movieVectors[idx];
    const scored = this.movies
      .map((movie, i) => ({
        movie,
        score: i === idx ? -1 : cosineSimilarity(target, this.movieVectors[i]),
      }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, topN).map(({ movie, score }) => ({
      ...movie,
      matchScore: Math.round(score * 100),
    }));
  }

  _explain(movie, prefs) {
    const matchedGenres = (prefs.genres || []).filter((g) =>
      movie.genres.map((x) => x.toLowerCase()).includes(g.toLowerCase())
    );
    const matchedMood = movie.mood.find(
      (m) => prefs.mood && m.toLowerCase().includes(prefs.mood.toLowerCase())
    );
    const matchedCharacter =
      prefs.character &&
      movie.characters.some((c) =>
        c.toLowerCase().includes(prefs.character.toLowerCase())
      );

    const reasons = [];
    if (matchedGenres.length) {
      reasons.push(`matches your love of ${matchedGenres.join(" and ")} stories`);
    }
    if (matchedMood) {
      reasons.push(`fits a ${matchedMood} mood`);
    }
    if (matchedCharacter) {
      reasons.push(`features ${prefs.character}`);
    }
    if (!reasons.length) {
      reasons.push("closely matches the themes you described");
    }
    return `Recommended because it ${reasons.join(", ")}.`;
  }
}

module.exports = { RecommendationEngine, tokenize };
