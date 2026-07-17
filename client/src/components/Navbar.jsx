import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/recommend", label: "AI Recommend" },
  { to: "/profile", label: "My List" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/40">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-script text-2xl text-hotpink">
          <span aria-hidden>🎀</span>
          Dreamhouse Cinema
        </NavLink>
        <ul className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-hotpink text-white shadow-glass"
                      : "text-plum/70 hover:bg-blush"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
