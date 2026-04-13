import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const genres = [
  "DRAMA", "THRILLER", "ACTION", "ROMANTIC", "COMEDY", "HISTORICAL", "ANIMATION", "SPORTS", "SOCIAL", "WAR"
];
const languages = [
  "ENGLISH", "HINDI", "MARATHI", "TAMIL", "TELUGU", "KANNADA", "BENGALI", "PUNJABI"
];

const ADMIN_SIDEBAR_LINKS = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "Movies", icon: "🎬", path: "/admin/movies" },
  { label: "Add Movie", icon: "➕", path: "/admin/add-movie" },
  { label: "Theaters", icon: "🏢", path: "/admin/theaters" },
  { label: "Add Theater", icon: "➕", path: "/admin/add-theater" },
  { label: "Shows", icon: "🕒", path: "/admin/shows" },
  { label: "Add Show", icon: "➕", path: "/admin/add-show" },
];

const AdminMovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [editMovie, setEditMovie] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState({ name: "", role: "" });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username") || "Admin";
    setAdmin({ name, role: role || "ADMIN" });
    if (role !== "ADMIN") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/all`);
        setMovies(res.data);
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    setDeleteMsg("");
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
      setDeleteMsg("Movie deleted successfully.");
    } catch (err) {
      setDeleteMsg("Failed to delete movie.");
    }
  };

  const openEditModal = (movie) => {
    setEditMovie(movie);
    setEditForm({
      movieName: movie.movieName,
      duration: movie.duration,
      rating: movie.rating,
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
      genre: movie.genre,
      language: movie.language,
      imageUrl: movie.imageUrl,
    });
    setUpdateMsg("");
  };

  const closeEditModal = () => {
    setEditMovie(null);
    setEditForm(null);
    setUpdateMsg("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/movies/${editMovie.id}`,
        {
          ...editForm,
          duration: Number(editForm.duration),
          rating: Number(editForm.rating),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMovies((prev) =>
        prev.map((m) => (m.id === editMovie.id ? { ...m, ...editForm } : m))
      );
      setUpdateMsg("Movie updated successfully.");
      setTimeout(() => closeEditModal(), 1200);
    } catch (err) {
      setUpdateMsg("Failed to update movie.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter movies by search
  const filteredMovies = movies.filter((movie) =>
    movie.movieName.toLowerCase().includes(search.toLowerCase())
  );

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow p-10 text-center border-t-8 border-red-500">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized</h2>
            <p className="text-gray-700">You do not have permission to view this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-blue-200 flex flex-col relative">
      {/* Animated/floating background shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-yellow-100 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <Navbar />
      <div className="flex flex-1 w-full max-w-8xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 min-h-full py-10 px-4 bg-white/70 backdrop-blur-md border-r border-gray-200 shadow-2xl rounded-tr-3xl rounded-br-3xl mt-8 mb-8 mr-6">
          <div className="flex flex-col items-center mb-10">
            <span className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-2xl font-extrabold border-2 border-pink-200 shadow-lg mb-2">
              {admin.name[0]}
            </span>
            <div className="font-bold text-lg text-gray-800">{admin.name}</div>
            <div className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 font-bold uppercase inline-block">{admin.role}</div>
          </div>
          <nav className="flex flex-col gap-2 w-full">
            {ADMIN_SIDEBAR_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-gray-700 hover:bg-pink-100 hover:text-pink-600 ${location.pathname === link.path ? 'bg-pink-500/20 text-pink-600 font-bold shadow' : ''}`}
              >
                <span className="text-lg">{link.icon}</span> {link.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 py-12 px-2 md:px-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-red-600 text-center tracking-tight drop-shadow-lg">All Movies</h2>
          <div className="rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl p-10 border-l-8 border-red-500 mb-10 relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <span className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-2xl font-extrabold border-2 border-pink-200 shadow-lg">
                  {admin.name[0]}
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-800">{admin.name}</div>
                  <div className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded mt-1 font-bold uppercase inline-block">{admin.role}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end items-end">
                <input
                  type="text"
                  placeholder="Search by movie name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition bg-white/60"
                />
                <button
                  onClick={() => window.location.href = '/admin/add-movie'}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-xl shadow hover:from-pink-600 hover:to-red-600 text-lg transition"
                >
                  Add Movie
                </button>
              </div>
            </div>
            {deleteMsg && <div className={`mb-4 text-center font-semibold ${deleteMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{deleteMsg}</div>}
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="relative rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl p-6 flex flex-col items-center group hover:scale-105 transition-all duration-300 border-t-4 border-pink-400">
                    <img src={movie.imageUrl} alt={movie.movieName} className="w-40 h-60 object-cover rounded-xl shadow-lg border-2 border-pink-100 mb-4" />
                    <div className="font-extrabold text-lg text-gray-800 mb-1 text-center truncate w-full">{movie.movieName}</div>
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                      <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-semibold">{movie.genre}</span>
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">{movie.language}</span>
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-semibold">{movie.releaseDate}</span>
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">⭐ {movie.rating}</span>
                    </div>
                    <div className="flex gap-3 mt-4 w-full justify-center">
                      <button onClick={() => openEditModal(movie)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Update</button>
                      <button onClick={() => handleDelete(movie.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Edit Movie Modal */}
          {editMovie && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative border-t-8 border-yellow-400">
                <button onClick={closeEditModal} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                <h3 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Update Movie</h3>
                {updateMsg && <div className={`mb-2 text-center font-semibold ${updateMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>{updateMsg}</div>}
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Movie Name</label>
                    <input type="text" name="movieName" value={editForm.movieName} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-gray-700">Duration (minutes)</label>
                      <input type="number" name="duration" value={editForm.duration} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-gray-700">Rating</label>
                      <input type="number" step="0.1" name="rating" value={editForm.rating} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Release Date</label>
                    <input type="date" name="releaseDate" value={editForm.releaseDate} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-gray-700">Genre</label>
                      <select name="genre" value={editForm.genre} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60">
                        <option value="">Select Genre</option>
                        {genres.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-gray-700">Language</label>
                      <select name="language" value={editForm.language} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60">
                        <option value="">Select Language</option>
                        {languages.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Image URL</label>
                    <input type="text" name="imageUrl" value={editForm.imageUrl} onChange={handleEditChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white/60" />
                  </div>
                  <button type="submit" disabled={updating} className="w-full bg-yellow-400 text-white font-bold py-3 rounded-xl shadow hover:bg-yellow-500 transition disabled:opacity-60">{updating ? "Updating..." : "Update Movie"}</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminMovieList; 