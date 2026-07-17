import { Link } from "react-router-dom";
import PosterPlaceholder from "./PosterPlaceholder";

export default function MovieCard({ movie, favorite = false, onToggleFavorite, matchBadge }) {
  return (
    <div className="ticket-card glass shadow-glass hover:shadow-glass-lg transition-shadow group relative flex flex-col">
      <Link to={`/movies/${movie.id}`} className="block relative">
        <PosterPlaceholder movie={movie} className="w-full aspect-[5/7] object-cover" />
        {matchBadge != null && (
          <span className="absolute top-3 right-3 bg-gold text-plum text-xs font-bold px-2 py-1 rounded-full shadow">
            {matchBadge}% match
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/movies/${movie.id}`}>
            <h3 className="font-display font-semibold text-plum leading-snug hover:text-hotpink transition-colors">
              {movie.title}
            </h3>
          </Link>
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(movie)}
            aria-label={favorite ? "Remove from My List" : "Add to My List"}
            className={`shrink-0 text-xl transition-transform hover:scale-125 ${
              favorite ? "text-hotpink" : "text-plum/30"
            }`}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1 text-xs">
          <span className="bg-blush text-plum/70 px-2 py-0.5 rounded-full">{movie.year}</span>
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className="bg-lilac/30 text-plum/70 px-2 py-0.5 rounded-full">
              {g}
            </span>
          ))}
        </div>

        <p className="text-sm text-plum/70 line-clamp-2">{movie.summary}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-plum/50 flex items-center gap-1">
            ⭐ {movie.rating?.toFixed(1) ?? "—"}
          </span>
          <span className="text-xs font-semibold text-plum/60">
            {movie.year}
          </span>
        </div>
      </div>
    </div>
  );
}
