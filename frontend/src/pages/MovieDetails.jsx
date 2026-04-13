import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

// Helper to decode JWT and get username - FINAL VERSION
const getUsernameFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    // The username claim can be 'sub' or 'name'. This checks for both.
    return payload.sub || payload.name;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};


// Helper function to format duration from minutes to "Xh Ym"
const formatDuration = (minutes) => {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let durationString = "";
  if (hours > 0) {
    durationString += `${hours}h `;
  }
  if (mins > 0) {
    durationString += `${mins}m`;
  }
  return durationString.trim();
};

// Helper function to format date from "YYYY-MM-DD" to "DD Mon, YYYY"
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};


// Star Rating Component
const StarRating = ({ rating, setRating }) => {
    return (
      <div className="flex items-center">
        {[...Array(10)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`cursor-pointer text-3xl ${
                starValue <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(starValue)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
};


const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  
  // Add Review Form State
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  // Edit Review State
  const [editingReview, setEditingReview] = useState(null); // To hold the review object being edited
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);

  // User State
  const [currentUser, setCurrentUser] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");


  const fetchReviews = useCallback(async () => {
    try {
        setLoadingReviews(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/reviews/movie/${id}`);
        setReviews(response.data);
        setReviewError(null);
    } catch (err) {
        setReviewError("Failed to load reviews.");
        console.error("Error fetching reviews:", err);
    } finally {
        setLoadingReviews(false);
    }
  }, [id]);


  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${id}`);
        setMovie(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        setCurrentUser(getUsernameFromToken());
        fetchMovieDetails();
        fetchReviews();
    }
  }, [id, fetchReviews]);


  // --- Review Handlers ---

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (newReviewRating === 0 || !newReviewComment) {
        alert("Please provide a rating and a comment.");
        return;
    }
    try {
        const token = localStorage.getItem("token");
        await axios.post(
            `${import.meta.env.VITE_BACKEND_API}/reviews/add`, 
            {
                movieId: id,
                rating: newReviewRating,
                comment: newReviewComment,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setNewReviewComment("");
        setNewReviewRating(0);
        await fetchReviews(); // Refresh reviews list
    } catch (err) {
        alert("Error adding review. You may have already reviewed this movie.");
        console.error("Error adding review:", err);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    if (editRating === 0 || !editComment) {
        alert("Rating and comment cannot be empty.");
        return;
    }
    try {
        const token = localStorage.getItem("token");
        await axios.put(
            `${import.meta.env.VITE_BACKEND_API}/reviews/update/${reviewId}`,
            { rating: editRating, comment: editComment },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingReview(null); // Exit editing mode
        await fetchReviews(); // Refresh reviews
    } catch (err) {
        alert("Failed to update review.");
        console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/reviews/delete/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchReviews(); // Refresh reviews
        } catch (err) {
            alert("Failed to delete review.");
            console.error("Error deleting review:", err);
        }
    }
  };

  const startEditing = (review) => {
    setEditingReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };


  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl text-red-500">{error}</div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl">Movie not found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Movie Banner with Blurred Background */}
      <div className="relative w-full" style={{ minHeight: "480px" }}>
        {/* Blurred, darkened background */}
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: movie?.imageUrl ? `url(${movie.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
            opacity: 0.7,
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 w-full h-full z-10 bg-black bg-opacity-60" />
        {/* Main content row */}
        <div className="relative z-20 flex flex-row items-start justify-center gap-16 px-16 py-12 w-full" style={{ minHeight: "480px" }}>
          {/* Movie Poster */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white" style={{ minWidth: 320, minHeight: 480 }}>
            <img
              src={movie.imageUrl}
              alt={movie.movieName}
              className="w-80 h-[32rem] object-cover"
            />
          </div>
          {/* Movie Details */}
          <div className="flex flex-col justify-center max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-lg">{movie.movieName}</h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center bg-pink-500/90 px-6 py-3 rounded-lg text-2xl font-bold text-white shadow">
                <span className="text-white mr-3">★</span>
                {movie.rating}/10
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-white/80 px-4 py-2 rounded text-base text-pink-600 font-semibold shadow">2D</span>
              <span className="bg-white/80 px-4 py-2 rounded text-base text-pink-600 font-semibold shadow">{movie.language}</span>
            </div>
            <div className="flex flex-wrap items-center gap-8 mb-8 text-white font-medium text-lg">
              <span>{formatDuration(movie.duration)}</span>
              <span>{movie.genre}</span>
              <span>{formatDate(movie.releaseDate)}</span>
            </div>
            <Link
              to={`/movie/${id}/book`}
              className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-xl font-extrabold text-2xl mt-2 inline-block text-center shadow-xl transition-all duration-200 hover:scale-105 border-2 border-white"
            >
              Book tickets
            </Link>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div className="w-full px-16 py-12 bg-white flex flex-col items-center border-b-2 border-pink-100">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-extrabold mb-6 text-red-600 border-b pb-2 border-pink-200 flex items-center gap-3">
            <span className="text-4xl">🎬</span> About the Movie
          </h2>
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><span className="text-lg">🏷️</span> {movie.genre}</span>
            {movie.language && <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><span className="text-lg">🌐</span> {movie.language}</span>}
            {movie.releaseDate && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><span className="text-lg">📅</span> {formatDate(movie.releaseDate)}</span>}
            {movie.duration && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><span className="text-lg">⏱️</span> {formatDuration(movie.duration)}</span>}
          </div>
          <div className="bg-pink-50 border-l-4 border-pink-400 rounded-xl p-6 shadow mb-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-2">
              <span className="font-semibold text-pink-600">{movie.movieName}</span> is a captivating <span className="font-semibold text-red-500">{movie.genre.toLowerCase()}</span> film delivered in <span className="font-semibold text-blue-500">{movie.language}</span>. With a compelling storyline, powerful performances, and stunning visuals, it keeps audiences hooked from start to finish. Whether you're a fan of intense drama, thrilling suspense, or heartfelt emotion—this film delivers an unforgettable experience.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-base ml-2">
              <li><span className="font-semibold text-gray-800">Release Date:</span> {formatDate(movie.releaseDate)}</li>
              <li><span className="font-semibold text-gray-800">Duration:</span> {formatDuration(movie.duration)}</li>
              <li><span className="font-semibold text-gray-800">Language:</span> {movie.language}</li>
              <li><span className="font-semibold text-gray-800">Genre:</span> {movie.genre}</li>
              {/* Optionally add director/cast if available in movie object */}
              {movie.director && <li><span className="font-semibold text-gray-800">Director:</span> {movie.director}</li>}
              {movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0 && (
                <li><span className="font-semibold text-gray-800">Cast:</span> {movie.cast.join(", ")}</li>
              )}
            </ul>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-pink-500 text-2xl">⭐</span>
            <span className="font-bold text-lg text-gray-700">{movie.rating}/10 IMDb User Rating</span>
          </div>
        </div>
      </div>
      
      {/* Review Section Start */}
      <div className="w-full px-16 py-12 bg-pink-50 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h3 className="text-2xl font-extrabold mb-8 text-red-600 flex items-center gap-2">
            <span className="text-3xl">💬</span> Reviews
          </h3>
            
          {/* Add Review Form */}
          {isLoggedIn && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200 mb-8">
                <h4 className="text-xl font-bold text-red-700 mb-4">Add Your Review</h4>
                <form onSubmit={handleAddReview}>
                    <div className="mb-4">
                        <label className="font-semibold mb-2 block">Your Rating (out of 10):</label>
                        <StarRating rating={newReviewRating} setRating={setNewReviewRating} />
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold mb-2 block">Your Comment:</label>
                        <textarea 
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 transition"
                            rows="4"
                            placeholder="Share your thoughts about the movie..."
                        />
                    </div>
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition">
                        Submit Review
                    </button>
                </form>
            </div>
          )}

          {/* Display Reviews */}
          <div className="space-y-8">
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : reviewError ? (
                <p className="text-red-500">{reviewError}</p>
            ) : reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200 transition-transform duration-200">
                        {editingReview?.id === review.id ? (
                            // --- Edit View ---
                            <div>
                                <h4 className="font-bold text-red-700 mb-2">Editing Review</h4>
                                <div className="mb-3">
                                    <StarRating rating={editRating} setRating={setEditRating} />
                                </div>
                                <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows="3"
                                />
                                <div className="flex gap-4 mt-3">
                                    <button onClick={() => handleUpdateReview(review.id)} className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600">Save</button>
                                    <button onClick={() => setEditingReview(null)} className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            // --- Display View ---
                            <div className="flex gap-6 items-start">
                                <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white flex-shrink-0">
                                    {review.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-semibold text-lg text-red-700">{review.user.username}</span>
                                                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(10)].map((_, i) => (
                                                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                                ))}
                                                <span className="ml-2 font-bold text-gray-700">{review.rating}/10</span>
                                            </div>
                                        </div>
                                        {/* Edit and Delete Buttons - THE CORE LOGIC */}
                                        
                                            <div className="flex gap-2">
                                                <button onClick={() => startEditing(review)} className="text-sm text-blue-500 hover:underline">Edit</button>
                                                <button onClick={() => handleDeleteReview(review.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                                            </div>
                                        
                                    </div>
                                    <p className="text-gray-700 text-base font-medium">{review.comment}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8 bg-white rounded-xl shadow-md">
                    <p className="text-gray-600 font-medium">Be the first to write a review!</p>

                </div>
            )}
          </div>
        </div>
      </div>
      {/* Review Section End */}
      <Footer />
    </div>
  );
};

export default MovieDetails;