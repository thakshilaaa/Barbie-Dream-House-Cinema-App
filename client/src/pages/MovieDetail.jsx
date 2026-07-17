import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import PosterPlaceholder from "../components/PosterPlaceholder";
import MovieCard from "../components/MovieCard";
import StarRating from "../components/StarRating";
import { useRatings } from "../lib/useRatings";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { getEntry, toggleFavorite, setStars } = useRatings();

  useEffect(() => {
    setMovie(null);
    setNotFound(false);
    api
      .getMovie(id)
      .then(setMovie)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl mb-4">🎀</p>
        <h1 className="font-display text-2xl font-semibold mb-2">Movie not found</h1>
        <Link to="/gallery" className="text-hotpink font-semibold hover:underline">
          ← Back to the gallery
        </Link>
      </div>
    );
  }

  if (!movie) {
    return <p className="text-center py-24 text-plum/50">Loading…</p>;
  }

  const entry = getEntry(movie.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/gallery" className="text-sm text-hotpink hover:underline">
        ← Back to gallery
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 mt-4">
        <div className="ticket-card shadow-glass-lg self-start">
          <PosterPlaceholder movie={movie} className="w-full" />
        </div>

        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            <span className="bg-blush px-3 py-1 rounded-full">{movie.year}</span>
            <span className="bg-blush px-3 py-1 rounded-full">{movie.duration} min</span>
            {movie.genres.map((g) => (
              <span key={g} className="bg-lilac/30 px-3 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>

          <p className="text-plum/80 leading-relaxed mb-6">{movie.summary}</p>

          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">Characters</p>
              <p className="text-sm text-plum/80">{movie.characters.join(", ")}</p>
            </div>
          </div>

          <div className="glass rounded-ticket shadow-glass p-5 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">Community rating</p>
              <p className="font-semibold">⭐ {movie.rating?.toFixed(1)} / 5</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-plum/50 mb-1">Your rating</p>
              <StarRating value={entry?.rating || 0} onChange={(v) => setStars(movie, v)} />
            </div>
            <button
              onClick={() => toggleFavorite(movie)}
              className={`ml-auto px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                entry?.favorite
                  ? "bg-hotpink text-white"
                  : "bg-white text-plum border border-blush hover:bg-blush"
              }`}
            >
              {entry?.favorite ? "♥ In My List" : "♡ Add to My List"}
            </button>
          </div>
        </div>
      </div>

      {movie.similar?.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl font-semibold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {movie.similar.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                favorite={getEntry(m.id)?.favorite}
                onToggleFavorite={toggleFavorite}
                matchBadge={m.matchScore}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
