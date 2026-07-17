import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useRatings } from "../lib/useRatings";

const YEAR_BUCKETS = ["2001-2005", "2006-2010", "2011-2015", "2016-2020", "2021-2025"];

export default function Gallery() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [yearBucket, setYearBucket] = useState("");
  const [loading, setLoading] = useState(true);
  const { getEntry, toggleFavorite } = useRatings();

  useEffect(() => {
    api.getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    if (yearBucket) params.year = yearBucket;
    const timeout = setTimeout(() => {
      api
        .getMovies(params)
        .then(setMovies)
        .catch(() => setMovies([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, genre, yearBucket]);

  const activeFilters = useMemo(
    () => [genre, yearBucket].filter(Boolean).length,
    [genre, yearBucket]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-2">Barbie Film Archive</h1>
      <p className="text-plum/60 mb-6">Search and filter 45 Barbie films by theme, genre, and release era.</p>

      <div className="glass rounded-ticket shadow-glass p-4 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, character, or theme…"
          className="flex-1 rounded-full px-4 py-2 bg-white border border-blush focus:outline-none focus:ring-2 focus:ring-hotpink text-sm"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full px-4 py-2 bg-white border border-blush text-sm focus:outline-none focus:ring-2 focus:ring-hotpink"
        >
          <option value="">All categories</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={yearBucket}
          onChange={(e) => setYearBucket(e.target.value)}
          className="rounded-full px-4 py-2 bg-white border border-blush text-sm focus:outline-none focus:ring-2 focus:ring-hotpink"
        >
          <option value="">All years</option>
          {YEAR_BUCKETS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {activeFilters > 0 && (
          <button
            onClick={() => {
              setGenre("");
              setYearBucket("");
            }}
            className="text-sm font-semibold text-hotpink hover:underline whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-plum/50 py-16">Loading movies…</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-plum/50 py-16">
          No movies match those filters. Try widening your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={getEntry(movie.id)?.favorite}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
