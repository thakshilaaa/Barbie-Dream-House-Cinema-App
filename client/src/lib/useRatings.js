import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { getGuestId, getStoredUser } from "./user";

export function useRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getStoredUser()?.id || getGuestId();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getRatings(userId);
      setRatings(data);
    } catch {
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getEntry = (movieId) => ratings.find((r) => r.movieId === movieId);

  const toggleFavorite = async (movie) => {
    const existing = getEntry(movie.id);
    const updated = await api.setRating({
      userId,
      movieId: movie.id,
      favorite: !existing?.favorite,
    });
    setRatings((prev) => {
      const others = prev.filter((r) => r.movieId !== movie.id);
      return [...others, updated];
    });
  };

  const setStars = async (movie, rating) => {
    const updated = await api.setRating({ userId, movieId: movie.id, rating });
    setRatings((prev) => {
      const others = prev.filter((r) => r.movieId !== movie.id);
      return [...others, updated];
    });
  };

  return { ratings, loading, getEntry, toggleFavorite, setStars, refresh, userId };
}
