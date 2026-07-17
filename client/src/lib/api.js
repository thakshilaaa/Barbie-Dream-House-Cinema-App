const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getMovies: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/movies${qs ? `?${qs}` : ""}`);
  },
  getMovie: (id) => request(`/movies/${id}`),
  getGenres: () => request(`/genres`),
  recommend: (prefs) =>
    request(`/recommend`, { method: "POST", body: JSON.stringify(prefs) }),
  chat: (message) =>
    request(`/chat`, { method: "POST", body: JSON.stringify({ message }) }),
  getRatings: (userId) => request(`/ratings/${userId}`),
  setRating: (payload) =>
    request(`/ratings`, { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) =>
    request(`/users/register`, { method: "POST", body: JSON.stringify(payload) }),
};
