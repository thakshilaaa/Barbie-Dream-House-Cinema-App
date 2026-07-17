import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";
import { useRatings } from "../lib/useRatings";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { getEntry, toggleFavorite } = useRatings();

  useEffect(() => {
    api
      .getMovies()
      .then((all) => {
        const top = [...all].sort((a, b) => b.rating - a.rating).slice(0, 6);
        setFeatured(top);
      })
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-grad">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative overflow-hidden">
          <span className="absolute top-8 left-10 text-3xl animate-floaty select-none" aria-hidden>
            ✨
          </span>
          <span
            className="absolute top-24 right-16 text-4xl animate-floaty select-none"
            style={{ animationDelay: "1s" }}
            aria-hidden
          >
            🎀
          </span>
          <span
            className="absolute bottom-4 left-1/4 text-2xl animate-floaty select-none"
            style={{ animationDelay: "2s" }}
            aria-hidden
          >
            💗
          </span>

          <p className="uppercase tracking-[0.3em] text-xs font-semibold text-hotpink mb-4">
            45 films · 2001–2025
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold shimmer-text mb-6">
            Barbie Film Archive
            <br /> & AI Recommendations
          </h1>
          <p className="text-plum/70 max-w-xl mx-auto mb-8">
            Explore a growing archive of Barbie movies, read story summaries, check release years,
            and let our AI-powered recommendation system suggest the next film that fits your taste.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/gallery"
              className="bg-ribbon-grad text-white font-semibold px-6 py-3 rounded-full shadow-glass-lg hover:scale-105 transition-transform"
            >
              Explore the Archive
            </Link>
            <Link
              to="/recommend"
              className="glass text-plum font-semibold px-6 py-3 rounded-full shadow-glass hover:scale-105 transition-transform"
            >
              Try AI Recommendations
            </Link>
          </div>
        </div>
      </section>

      <div className="filmstrip" />

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-plum">
            Featured Archive Picks
          </h2>
          <Link to="/gallery" className="text-sm font-semibold text-hotpink hover:underline">
            Browse all 45 →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={getEntry(movie.id)?.favorite}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-blush/60">
        <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🎬", title: "Explore", text: "Browse posters, summaries and trailers for 45 films." },
            { icon: "🧠", title: "Tell us your taste", text: "Pick genres, a favorite character and your mood." },
            { icon: "💌", title: "Get matched", text: "Our TF-IDF engine finds the movies that fit you best." },
          ].map((step) => (
            <div key={step.title} className="glass rounded-ticket p-6 shadow-glass">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-display font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-plum/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
