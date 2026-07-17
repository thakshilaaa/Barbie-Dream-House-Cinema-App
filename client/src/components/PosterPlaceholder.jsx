import { useState } from "react";
import { buildPosterSvg } from "../lib/posterArt";

const FALLBACK_SVG_CACHE = {};

function getSvgFallback(movie) {
  if (!FALLBACK_SVG_CACHE[movie.id]) {
    FALLBACK_SVG_CACHE[movie.id] = "data:image/svg+xml;utf8," + encodeURIComponent(buildPosterSvg(movie));
  }
  return FALLBACK_SVG_CACHE[movie.id];
}

export default function PosterPlaceholder({ movie, className = "" }) {
  const [src, setSrc] = useState(movie.poster || null);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setSrc(getSvgFallback(movie));
    }
  };

  if (!src) {
    return (
      <img
        src={getSvgFallback(movie)}
        alt={`Poster art for ${movie.title}`}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={src}
      alt={`Poster art for ${movie.title}`}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}
