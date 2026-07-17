import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I'm your Dreamhouse Cinema assistant 🎀 Tell me what you're in the mood for — magical, musical, sisterly, adventurous — and I'll suggest a movie.",
      movies: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const { reply, movies } = await api.chat(text);
      setMessages((m) => [...m, { from: "bot", text: reply, movies }]);
    } catch {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Hmm, I couldn't reach the recommendation server. Is the backend running?", movies: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[340px] max-h-[480px] flex flex-col glass shadow-glass-lg rounded-ticket overflow-hidden border border-white/60">
          <div className="bg-ribbon-grad text-white px-4 py-3 flex items-center justify-between">
            <span className="font-display font-semibold">Barbie Movie Assistant 🎀</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/90 hover:text-white">
              ✕
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-white/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user" ? "bg-hotpink text-white" : "bg-white text-plum shadow-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.movies?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {m.movies.map((mv) => (
                        <li key={mv.id}>
                          <Link
                            to={`/movies/${mv.id}`}
                            className="text-hotpink font-medium hover:underline text-xs"
                            onClick={() => setOpen(false)}
                          >
                            🎬 {mv.title} ({mv.year})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-plum/50 px-1">Thinking…</p>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-white/60 bg-white/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="I like princess movies..."
              className="flex-1 rounded-full px-3 py-2 text-sm bg-white border border-blush focus:outline-none focus:ring-2 focus:ring-hotpink"
            />
            <button
              type="submit"
              className="bg-hotpink text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-magenta transition-colors"
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-ribbon-grad shadow-glass-lg text-white text-2xl flex items-center justify-center animate-floaty hover:animate-none hover:scale-105 transition-transform"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
