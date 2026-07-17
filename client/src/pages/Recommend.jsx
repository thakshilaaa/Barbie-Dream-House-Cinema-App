import { useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useRatings } from "../lib/useRatings";

const GENRE_OPTIONS = [
  "Fantasy", "Adventure", "Romance", "Music", "Friendship",
  "Fashion", "Superhero", "Sci-Fi", "Comedy", "Nature", "Holiday",
];
const MOOD_OPTIONS = ["magical", "adventurous", "heartwarming", "empowering", "fun", "musical"];

export default function Recommend() {
  const [step, setStep] = useState(0);
  const [genres, setGenres] = useState([]);
  const [character, setCharacter] = useState("");
  const [mood, setMood] = useState("");
  const [freeText, setFreeText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getEntry, toggleFavorite } = useRatings();

  const toggleGenre = (g) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  async function getRecommendations() {
    setLoading(true);
    try {
      const data = await api.recommend({ genres, character, mood, freeText });
      setResults(data);
      setStep(4);
    } catch {
      setResults([]);
      setStep(4);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setGenres([]);
    setCharacter("");
    setMood("");
    setFreeText("");
    setResults(null);
    setStep(0);
  }

  const steps = ["Genres", "Mood", "Details", "Results"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-center mb-2">
        ✨ AI Recommendation Quiz
      </h1>
      <p className="text-center text-plum/60 mb-8">
        Answer a few quick questions and our recommendation engine will find your matches.
      </p>

      {/* progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= step ? "bg-hotpink text-white" : "bg-blush text-plum/40"
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? "bg-hotpink" : "bg-blush"}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <QuizCard title="What type of Barbie movie do you like?">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {GENRE_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  genres.includes(g)
                    ? "bg-hotpink text-white border-hotpink"
                    : "bg-white border-blush text-plum/70 hover:border-hotpink"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <NextButton onClick={() => setStep(1)} disabled={genres.length === 0} />
        </QuizCard>
      )}

      {step === 1 && (
        <QuizCard title="What's your mood?">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-4 py-2 rounded-full text-sm font-medium border capitalize transition-colors ${
                  mood === m
                    ? "bg-hotpink text-white border-hotpink"
                    : "bg-white border-blush text-plum/70 hover:border-hotpink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <BackButton onClick={() => setStep(0)} />
            <NextButton onClick={() => setStep(2)} disabled={!mood} />
          </div>
        </QuizCard>
      )}

      {step === 2 && (
        <QuizCard title="Anything else? (favorite character, themes…)">
          <input
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="Favorite character (e.g. Barbie, Rapunzel, Chelsea)"
            className="w-full rounded-full px-4 py-3 bg-white border border-blush mb-3 focus:outline-none focus:ring-2 focus:ring-hotpink text-sm"
          />
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Describe what you're in the mood for, in your own words…"
            rows={3}
            className="w-full rounded-2xl px-4 py-3 bg-white border border-blush mb-6 focus:outline-none focus:ring-2 focus:ring-hotpink text-sm"
          />
          <div className="flex justify-center gap-3">
            <BackButton onClick={() => setStep(1)} />
            <button
              onClick={getRecommendations}
              disabled={loading}
              className="bg-ribbon-grad text-white font-semibold px-6 py-3 rounded-full shadow-glass hover:scale-105 transition-transform disabled:opacity-60"
            >
              {loading ? "Finding matches…" : "✨ Get My Recommendations"}
            </button>
          </div>
        </QuizCard>
      )}

      {step === 4 && results && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">Your Recommendations</h2>
            <button onClick={restart} className="text-sm font-semibold text-hotpink hover:underline">
              ↺ Start over
            </button>
          </div>
          {results.length === 0 ? (
            <p className="text-center text-plum/50 py-10">
              We couldn't reach the recommendation engine. Make sure the backend server is running.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {results.map((movie) => (
                <div key={movie.id}>
                  <MovieCard
                    movie={movie}
                    favorite={getEntry(movie.id)?.favorite}
                    onToggleFavorite={toggleFavorite}
                    matchBadge={movie.matchScore}
                  />
                  <p className="text-xs text-plum/60 mt-2 px-1">{movie.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizCard({ title, children }) {
  return (
    <div className="glass rounded-ticket shadow-glass-lg p-8 text-center">
      <h2 className="font-display text-xl font-semibold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function NextButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-hotpink text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-40 hover:bg-magenta transition-colors"
    >
      Next →
    </button>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-blush text-plum font-semibold px-6 py-2.5 rounded-full hover:bg-blush transition-colors"
    >
      ← Back
    </button>
  );
}
