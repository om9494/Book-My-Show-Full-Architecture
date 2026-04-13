import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import Navbar from './Navbar';
import Footer from './Footer';
import RecommendedMovies from './RecommendedMovies';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchQuery, searchType, searchTypeLabel } = location.state || { 
    searchResults: [], 
    searchQuery: '', 
    searchType: 'movie',
    searchTypeLabel: 'movies'
  };

  const [theaterMovies, setTheaterMovies] = useState({});
  const [loadingTheaterMovies, setLoadingTheaterMovies] = useState(false);

  // Fetch movies for theaters when theater search results are displayed
  useEffect(() => {
    if (searchType === 'theater' && searchResults.length > 0) {
      fetchTheaterMovies();
    }
  }, [searchResults, searchType]);

  const fetchTheaterMovies = async () => {
    setLoadingTheaterMovies(true);
    try {
      const theaterMoviesData = {};
      
      for (const theater of searchResults) {
        try {
          // Get shows for this theater
          const showsResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_API}/shows/theater/${theater.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          if (showsResponse.data && showsResponse.data.length > 0) {
            // Get unique movies for this theater
            const movieIds = [...new Set(showsResponse.data.map(show => show.movieId))];
            const movies = [];
            
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
                movies.push(movieResponse.data);
              } catch (error) {
                console.error(`Error fetching movie ${movieId}:`, error);
              }
            }
            
            theaterMoviesData[theater.id] = movies;
          }
        } catch (error) {
          console.error(`Error fetching shows for theater ${theater.id}:`, error);
        }
      }
      
      setTheaterMovies(theaterMoviesData);
    } catch (error) {
      console.error('Error fetching theater movies:', error);
    } finally {
      setLoadingTheaterMovies(false);
    }
  };

  const handleTheaterClick = (theater) => {
    // Navigate to a theater details page or show movies for this theater
    navigate(`/theater/${theater.id}`, { 
      state: { 
        theater, 
        movies: theaterMovies[theater.id] || [] 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-blue-200 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-12xl mx-auto w-full py-12 px-4">
        <div className="rounded-3xl bg-white/80 shadow-2xl p-10 mb-12 border-t-8 border-red-400/60 backdrop-blur-md">
          <h2 className="text-4xl font-extrabold mb-6 text-red-500 text-center tracking-tight drop-shadow-lg">
            Search Results for <span className="bg-gradient-to-r from-pink-400 to-red-500 text-white px-3 py-1 rounded-xl shadow-md">"{searchQuery}"</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Found <span className="font-bold text-red-500">{searchResults.length}</span> {searchTypeLabel} matching your search
          </p>
          
          {searchResults && searchResults.length > 0 ? (
            searchType === 'movie' ? (
              // Display movie results
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.movieName}
                    poster={movie.imageUrl}
                    rating={movie.rating}
                    genre={movie.genre}
                  />
                ))}
              </div>
            ) : (
              // Display theater results
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((theater) => (
                  <div
                    key={theater.id}
                    className="bg-white/90 border border-gray-100 rounded-2xl p-8 hover:shadow-2xl shadow-lg transition-all cursor-pointer backdrop-blur-md group relative overflow-hidden"
                    onClick={() => handleTheaterClick(theater)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-500 transition-colors drop-shadow-sm">{theater.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">{theater.address}</p>
                        <p className="text-gray-500 text-sm">{theater.city}</p>
                        <p className="text-gray-400 text-xs">Screens: {theater.numberOfScreens}</p>
                      </div>
                      <div className="bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                        Theater
                      </div>
                    </div>
                    
                    {loadingTheaterMovies ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading movies...</p>
                      </div>
                    ) : theaterMovies[theater.id] && theaterMovies[theater.id].length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Now Showing:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {theaterMovies[theater.id].slice(0, 4).map((movie) => (
                            <div key={movie.id} className="text-xs bg-gray-50 rounded-lg px-2 py-1 shadow-sm">
                              <p className="font-medium text-gray-800 truncate">{movie.movieName}</p>
                              <p className="text-gray-500">{movie.genre}</p>
                            </div>
                          ))}
                          {theaterMovies[theater.id].length > 4 && (
                            <div className="text-xs text-gray-500 col-span-2">
                              +{theaterMovies[theater.id].length - 4} more movies
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No movies currently showing</p>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-xl hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all text-sm font-semibold shadow-md">
                        View Details
                      </button>
                    </div>
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-pink-100 rounded-full opacity-30 blur-2xl z-0"></div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="text-7xl mb-4 animate-bounce">🔍</div>
              <p className="text-xl text-gray-600 mb-2 font-semibold">No {searchTypeLabel} found matching <span className="text-red-500">"{searchQuery}"</span></p>
              <p className="text-gray-500">Try searching with different keywords or check your spelling.</p>
            </div>
          )}
        </div>
        
        {/* Related/Recommended Movies Section - only show for movie searches */}
        {searchType === 'movie' && (
          <div className="mt-16">
            <RecommendedMovies />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
