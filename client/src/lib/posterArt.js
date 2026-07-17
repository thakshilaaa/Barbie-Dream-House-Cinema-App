function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function colorFromSeed(seed, alpha = 1) {
  const hue = seed % 360;
  return `hsla(${hue}, 72%, ${clamp(42 + (seed % 20), 35, 70)}%, ${alpha})`;
}

function getShapeMarkup(movie, palette, titleWords) {
  const shapeCount = 3 + (hashString(movie.title) % 3);
  const shapes = [];

  for (let index = 0; index < shapeCount; index += 1) {
    const seed = hashString(`${movie.title}-${index}`);
    const x = 60 + (index * 55) % 180;
    const y = 70 + (seed % 180);
    const size = 18 + (seed % 28);
    const opacity = 0.18 + ((seed % 6) * 0.06);
    shapes.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="${colorFromSeed(seed + 40, opacity)}" />`);
  }

  const ribbon = `<rect x="35" y="292" width="230" height="88" rx="22" fill="${palette.ribbon}" />`;
  const sparkle = `<path d="M210 88l8 20 20 8-20 8-8 20-8-20-20-8 20-8z" fill="${palette.spark}" />`;
  const arc = `<path d="M72 232c20-42 58-66 105-66 44 0 81 18 103 48" stroke="${palette.line}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.55" />`;

  const word = titleWords[0] || "dream";
  const monogram = `<text x="150" y="244" text-anchor="middle" font-size="78" font-family="Georgia, serif" fill="${palette.text}">${word.slice(0, 2).toUpperCase()}</text>`;

  return `${shapes.join("")}${sparkle}${arc}${ribbon}${monogram}`;
}

export function buildPosterSvg(movie) {
  const titleWords = (movie.title || "Barbie Film")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  const seed = hashString(movie.title || "barbie");
  const background = colorFromSeed(seed + 12, 1);
  const accent = colorFromSeed(seed + 56, 1);
  const highlight = colorFromSeed(seed + 100, 1);
  const ribbon = colorFromSeed(seed + 144, 0.82);
  const spark = colorFromSeed(seed + 201, 0.95);
  const line = colorFromSeed(seed + 260, 0.9);
  const titleColor = colorFromSeed(seed + 320, 1);
  const subtitleColor = colorFromSeed(seed + 380, 0.95);

  const palette = { background, accent, highlight, ribbon, spark, line, text: titleColor, subtitle: subtitleColor };
  const titleText = movie.title.length > 30 ? `${movie.title.slice(0, 28)}…` : movie.title;
  const subtitle = [movie.year, ...(movie.genres || []).slice(0, 2)].join(" • ");
  const mood = movie.mood?.[0] || "magical";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420">
      <rect width="300" height="420" rx="30" fill="${palette.background}" />
      <rect x="20" y="20" width="260" height="380" rx="24" fill="${palette.accent}" opacity="0.18" stroke="rgba(255,255,255,0.42)" stroke-width="2" />
      <circle cx="226" cy="106" r="82" fill="${palette.highlight}" opacity="0.22" />
      <circle cx="79" cy="96" r="12" fill="rgba(255,255,255,0.7)" />
      <circle cx="232" cy="74" r="5" fill="rgba(255,255,255,0.7)" />
      <path d="M96 140c18-28 48-42 86-42 28 0 56 8 80 24" stroke="rgba(255,255,255,0.42)" stroke-width="6" stroke-linecap="round" fill="none" />
      ${getShapeMarkup(movie, palette, titleWords)}
      <rect x="32" y="34" width="64" height="28" rx="14" fill="rgba(255,255,255,0.9)" />
      <text x="64" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#4A1942" font-family="Poppins, sans-serif">${movie.year}</text>
      <rect x="212" y="34" width="54" height="28" rx="14" fill="rgba(255,255,255,0.18)" />
      <text x="239" y="52" text-anchor="middle" font-size="11" font-weight="600" fill="#fff" font-family="Poppins, sans-serif">${mood}</text>
      <rect x="26" y="314" width="248" height="78" rx="20" fill="rgba(74,25,66,0.74)" />
      <text x="150" y="338" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" font-family="Fraunces, serif">${titleText}</text>
      <text x="150" y="360" text-anchor="middle" font-size="12" font-weight="600" fill="rgba(255,255,255,0.92)" font-family="Poppins, sans-serif">${subtitle}</text>
    </svg>
  `;
}

export function buildPosterDataUrl(movie) {
  const svg = buildPosterSvg(movie);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
