import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const BookingSummary = () => {
    const query = useQuery();
    const navigate = useNavigate();
    
    const movie = query.get("movie");
    const theatre = query.get("theatre");
    const time = query.get("time");
    const seats = query.get("seats")?.split(",") || [];
    const amount = query.get("amount");
    const food = query.get("food");
    const movieId = query.get("movieId");

    const [movieData, setMovieData] = useState(null);
    const [bookingId, setBookingId] = useState(`BK${Date.now()}`);

    useEffect(() => {
        const fetchMoviePoster = async () => {
            if (!movieId) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/movies/id/${movieId}`, {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                setMovieData(response.data);
            } catch (error) {
                console.error("Error fetching movie poster:", error);
            }
        };
        fetchMoviePoster();
    }, [movieId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col">
            <Navbar />
            
            {/* Hero Section with Movie Background */}
            <div className="relative w-full" style={{ minHeight: "400px" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10" />
                <div className="absolute inset-0 z-0" style={{ 
                    backgroundImage: `url(${movieData?.imageUrl})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center",
                    filter: "blur(8px)"
                }}/>
                <div className="relative z-20 flex flex-col items-center justify-center p-8 text-center " style={{ minHeight: "400px", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
                    <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white p-8 rounded-full shadow-2xl mb-6 inline-block transform hover:scale-110 transition-all duration-300">
                        <span className="text-6xl">🎉</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-2xl">Booking Confirmed!</h1>
                    <p className="text-xl text-white/90 mb-2">Your tickets are ready. Enjoy the show!</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white/90 font-medium">
                        Booking ID: {bookingId}
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full py-12 px-4">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Booking Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50/50 to-blue-50/50"></div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <span className="text-3xl">🎬</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Booking Details</h2>
                                        <p className="text-gray-600">Complete information about your booking</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">🎭</span>
                                            <h3 className="font-bold text-gray-800">Movie</h3>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-700">{movie}</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">🏢</span>
                                            <h3 className="font-bold text-gray-800">Theatre</h3>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-700">{theatre}</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">🕐</span>
                                            <h3 className="font-bold text-gray-800">Showtime</h3>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-700">{time}</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">💺</span>
                                            <h3 className="font-bold text-gray-800">Seats</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {seats.map((seat, index) => (
                                                <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold border border-purple-200">
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Food Summary */}
                                {food && (
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-2xl">🍿</span>
                                            <h3 className="text-xl font-bold text-gray-800">Snacks & Beverages</h3>
                                        </div>
                                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {food.split(', ').map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3 bg-white/60 p-3 rounded-xl">
                                                        <span className="text-lg">🍽️</span>
                                                        <span className="font-medium text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Total Amount */}
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">💰</span>
                                            <span className="font-bold text-xl text-gray-800">Total Amount Paid</span>
                                        </div>
                                        <span className="font-bold text-3xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">₹{amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Booking Info Card */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">📅</span>
                                    <h3 className="font-bold text-gray-800">Booking Info</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium">{formatDate(new Date())}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time:</span>
                                        <span className="font-medium">{getCurrentTime()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Confirmed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/40">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚡</span>
                                    <h3 className="font-bold text-gray-800">Quick Actions</h3>
                                </div>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => navigate("/profile")} 
                                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span>🎫</span>
                                            View My Tickets
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => navigate("/")} 
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span>🏠</span>
                                            Back to Home
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">💡</span>
                                    <h3 className="font-bold text-gray-800">Pro Tips</h3>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Arrive 15 minutes before showtime
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Keep your booking ID handy
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        Mobile tickets are accepted
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookingSummary;