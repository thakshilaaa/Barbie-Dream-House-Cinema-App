import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import MovieDetail from "./pages/MovieDetail";
import Recommend from "./pages/Recommend";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                <p className="text-6xl mb-4">🎀</p>
                <h1 className="font-display text-2xl font-semibold">Page not found</h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
