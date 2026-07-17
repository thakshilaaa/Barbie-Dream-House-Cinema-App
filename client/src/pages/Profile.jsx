import { useEffect, useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useRatings } from "../lib/useRatings";
import { getStoredUser, storeUser } from "../lib/user";

export default function Profile() {
  const [user, setUser] = useState(getStoredUser());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const { ratings, getEntry, toggleFavorite, refresh } = useRatings();

  useEffect(() => {
    api.getMovies().then(setAllMovies).catch(() => setAllMovies([]));
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !email) return;
    const registered = await api.register({ name, email });
    storeUser(registered);
    setUser(registered);
    refresh();
  }

  const favoriteMovies = allMovies.filter(
    (m) => ratings.find((r) => r.movieId === m.id)?.favorite
  );
  const ratedMovies = allMovies
    .map((m) => ({ movie: m, entry: getEntry(m.id) }))
    .filter(({ entry }) => entry?.rating);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-2">My List</h1>
      <p className="text-plum/60 mb-8">Your saved favorites and personal ratings.</p>

      <div className="glass rounded-ticket shadow-glass p-5 mb-10 flex flex-wrap items-center gap-4">
        {user ? (
          <p className="text-sm">
            Signed in as <span className="font-semibold">{user.name}</span> ({user.email})
          </p>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-wrap gap-2 items-center flex-1">
            <p className="text-sm text-plum/60 w-full sm:w-auto">
              Optional — save your list under a name (demo only, no password):
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="rounded-full px-3 py-2 text-sm bg-white border border-blush focus:outline-none focus:ring-2 focus:ring-hotpink"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-full px-3 py-2 text-sm bg-white border border-blush focus:outline-none focus:ring-2 focus:ring-hotpink"
            />
            <button className="bg-hotpink text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-magenta transition-colors">
              Save
            </button>
          </form>
        )}
      </div>

      <h2 className="font-display text-xl font-semibold mb-4">♥ Favorites</h2>
      {favoriteMovies.length === 0 ? (
        <p className="text-plum/50 mb-10">
          No favorites yet — tap the heart on any movie card to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {favoriteMovies.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              favorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      <h2 className="font-display text-xl font-semibold mb-4">⭐ Your Ratings</h2>
      {ratedMovies.length === 0 ? (
        <p className="text-plum/50">Rate a movie on its detail page to see it here.</p>
      ) : (
        <ul className="space-y-2">
          {ratedMovies.map(({ movie, entry }) => (
            <li
              key={movie.id}
              className="glass rounded-full px-4 py-2 flex items-center justify-between text-sm"
            >
              <span className="font-medium">{movie.title}</span>
              <span className="text-gold">{"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
