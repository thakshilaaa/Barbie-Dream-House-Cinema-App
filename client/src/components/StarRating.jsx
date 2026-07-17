export default function StarRating({ value = 0, onChange, size = "text-lg", readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex gap-0.5 ${size}`} role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
          className={`transition-transform ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-125"
          }`}
        >
          <span className={s <= value ? "text-gold" : "text-plum/20"}>★</span>
        </button>
      ))}
    </div>
  );
}
