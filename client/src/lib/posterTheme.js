// Maps each genre to a distinct gradient + icon + motif so every
// placeholder poster feels intentional rather than randomly generated.
// These are original CSS gradients + emoji glyphs — no copyrighted artwork.

export const GENRE_THEMES = {
  Fantasy: { from: "#C9A7EB", to: "#E0218A", icon: "✨" },
  Adventure: { from: "#F4C95D", to: "#E0218A", icon: "🧭" },
  Romance: { from: "#FF9FC9", to: "#E0218A", icon: "💗" },
  Music: { from: "#8FE3D6", to: "#4A1942", icon: "🎵" },
  Friendship: { from: "#FFD6E8", to: "#C9A7EB", icon: "🤝" },
  Fashion: { from: "#F4C95D", to: "#FF5CA8", icon: "👗" },
  Superhero: { from: "#FF5CA8", to: "#4A1942", icon: "⚡" },
  "Sci-Fi": { from: "#8FE3D6", to: "#4A1942", icon: "🚀" },
  Comedy: { from: "#F4C95D", to: "#FF9FC9", icon: "😄" },
  Nature: { from: "#8FE3D6", to: "#C9A7EB", icon: "🌿" },
  Holiday: { from: "#8FE3D6", to: "#E0218A", icon: "❄️" },
  default: { from: "#C9A7EB", to: "#E0218A", icon: "🎬" },
};

export function themeForMovie(movie) {
  const primaryGenre = movie.genres?.[0] || "default";
  return GENRE_THEMES[primaryGenre] || GENRE_THEMES.default;
}
