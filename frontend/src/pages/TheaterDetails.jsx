import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import axios from 'axios';

const TheaterDetails = () => {
  const { theaterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { theater, movies } = location.state || {};
  
  const [theaterData, setTheaterData] = useState(theater);
  const [theaterMovies, setTheaterMovies] = useState(movies || []);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(!theater);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (!theater) {
      fetchTheaterData();
    }
    generateDates();
  }, [theaterId]);

  useEffect(() => {
    if (theaterData) {
      fetchTheaterShows();
    }
  }, [theaterData, selectedDate]);

  const generateDates = () => {
    const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
        date: date.getDate().toString().padStart(2, "0"),
        month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        fullDate: date.toISOString().split('T')[0]
      };
    });
    setDates(nextWeekDates);
  };

  const fetchTheaterData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/theaters/id/${theaterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTheaterData(response.data);
    } catch (error) {
      console.error('Error fetching theater data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTheaterShows = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/shows/theater/${theaterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const filteredShows = response.data.filter(show => 
        new Date(show.date).toISOString().split('T')[0] === selectedDate
      );
      
      setShows(filteredShows);
      
      // --- START OF FIX ---
      // The show object contains a 'movie' object. We need to access movie.id.
      const movieIds = [...new Set(filteredShows.map(show => show.movie.id))];
      // --- END OF FIX ---

      const moviesData = [];
      
      for (const movieId of movieIds) {
        try {
          const movieResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/movies/id/${movieId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          moviesData.push(movieResponse.data);
        } catch (error) {
          console.error(`Error fetching movie ${movieId}:`, error);
        }
      }
      
      setTheaterMovies(moviesData);
    } catch (error) {
      console.error('Error fetching theater shows:', error);
    }
  };

  const handleShowTimeClick = (show, movie) => {
    const time = show.time.slice(0, 5);
    const queryParams = new URLSearchParams({
        count: 1,
        theatre: theaterData.id,
        showId: show.showId,
        time: time
    }).toString();
    
    navigate(`/movie/${movie.id}/book/seats?${queryParams}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-200 opacity-20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-semibold text-lg">Loading theater details...</p>
            <div className="mt-2 text-sm text-gray-500">Preparing your cinematic experience</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!theaterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Theater Not Found</h2>
            <p className="text-gray-600 text-lg">The theater you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-purple-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-200 opacity-20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-yellow-200 opacity-15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full py-10 px-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-white/30 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-15 blur-xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-4 rounded-2xl shadow-lg">
                  <span className="text-3xl">🎬</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2 drop-shadow-sm">{theaterData.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">Active</span>
                    <span>•</span>
                    <span>{theaterData.numberOfScreens} Screens</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 border border-pink-200/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-500 text-white p-2 rounded-xl">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">{theaterData.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white p-2 rounded-xl">
                      <span className="text-xl">🏙️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">City</p>
                      <p className="text-sm text-gray-600">{theaterData.city}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 text-white p-2 rounded-xl">
                      <span className="text-xl">🎭</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Screens</p>
                      <p className="text-sm text-gray-600">{theaterData.numberOfScreens} Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-8">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300">
                Premium Theater
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-white/30 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-2 rounded-xl">
              📅
            </span>
            Select Your Preferred Date
          </h2>
          
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date.fullDate)}
                className={`flex flex-col items-center p-4 rounded-2xl min-w-[100px] transition-all duration-300 transform hover:scale-105 ${
                  selectedDate === date.fullDate
                    ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-xl scale-105'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-lg border border-white/30'
                }`}
              >
                <span className="text-sm font-semibold opacity-80">{date.day}</span>
                <span className="text-2xl font-bold">{date.date}</span>
                <span className="text-xs opacity-70">{date.month}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-15 blur-2xl"></div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-3 rounded-xl">
              🎬
            </span>
            Movies Showing on {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          
          {theaterMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {theaterMovies.map((movie) => {
                const movieShows = shows.filter(show => show.movie.id === movie.id);
                return (
                  <div key={movie.id} className="group relative">
                    <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                      <MovieCard
                        id={movie.id}
                        title={movie.movieName}
                        poster={movie.imageUrl}
                        rating={movie.rating}
                        genre={movie.genre}
                      />
                      
                      <div className="mt-6">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-1 rounded-lg text-sm">
                            🕐
                          </span>
                          Show Times:
                        </h4>
                        
                        {movieShows.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {movieShows.slice(0, 4).map((show) => (
                              <button
                                key={show.showId}
                                onClick={() => handleShowTimeClick(show, movie)}
                                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-105"
                              >
                                {show.time.slice(0, 5)}
                              </button>
                            ))}
                            {movieShows.length > 4 && (
                              <div className="col-span-2 text-center">
                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  +{movieShows.length - 4} more shows
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-2xl mb-2">⏰</div>
                            <p className="text-sm text-gray-500">No shows available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl p-12 max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-bounce">🎬</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No Movies Today</h3>
                <p className="text-gray-600 mb-6">Try selecting a different date or check back later for new releases.</p>
                <button 
                  onClick={() => setSelectedDate(dates[1]?.fullDate || selectedDate)}
                  className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                >
                  Try Tomorrow
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TheaterDetails;
