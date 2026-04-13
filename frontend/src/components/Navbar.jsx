import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [city, setCity] = useState(localStorage.getItem("city") || "Pune");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchType, setSearchType] = useState("movie");
  
  // --- START: State for mobile menu ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // --- END: State for mobile menu ---

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole);

      fetch(`${import.meta.env.VITE_BACKEND_API}/signup/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              handleLogout();
            }
            throw new Error("Failed to fetch user profile.");
          }
          return response.json();
        })
        .then((data) => {
          const fetchedRole = data.roles && data.roles.length > 0 ? data.roles[0] : "";
          localStorage.setItem("role", fetchedRole);
          setUserRole(fetchedRole);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setUserRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUsername("");
    setUserRole("");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchError("");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchError("Please enter a search term.");
      return;
    }

    if (searchType === "theater" && !isLoggedIn) {
      setSearchError("Please log in to search for theaters.");
      return;
    }

    try {
      let searchResults = [];
      let searchTypeLabel = "";

      if (searchType === "movie") {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/movies/search?name=${searchQuery.trim()}`
        );
        searchResults = response.data;
        searchTypeLabel = "movies";
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/theaters`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const allTheaters = response.data;
        searchResults = allTheaters.filter(theater =>
          theater.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          theater.city.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        searchTypeLabel = "theaters";
      }

      navigate(`/search-results?query=${searchQuery.trim()}&type=${searchType}`, { 
        state: { 
          searchResults, 
          searchQuery: searchQuery.trim(),
          searchType: searchType,
          searchTypeLabel
        } 
      });
      setSearchQuery("");
      setSearchError("");
      setIsMenuOpen(false); // Close mobile menu after search
    } catch (error) {
      console.error("Error searching:", error);
      setSearchError(`Failed to search ${searchType}. Please try again.`);
    }
  };

  const SearchErrorAlert = () => {
    if (!searchError) return null;
    const isLoginError = searchError.includes("log in");
    return (
      <div className="absolute left-0 top-full mt-2 w-full max-w-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-lg z-20" role="alert">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            <p className="font-semibold">{searchError}</p>
          </div>
          <div className="flex items-center">
            {isLoginError && (<button onClick={() => { navigate('/login'); setSearchError(''); }} className="ml-4 flex-shrink-0 bg-red-500 text-white px-4 py-1 rounded-md text-sm font-bold hover:bg-red-600 transition-transform transform hover:scale-105">Login</button>)}
            <button onClick={() => setSearchError('')} className="ml-3 text-red-500 hover:text-red-800 font-bold text-2xl leading-none">&times;</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="relative z-30 backdrop-blur-md bg-white/70 shadow-xl px-4 sm:px-8 py-4 flex items-center justify-between rounded-b-2xl border-b border-red-100/40 transition-all duration-300">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight drop-shadow-sm hover:scale-105 transition-transform">
            book<span className="text-red-600">my</span>show
          </Link>
          {/* --- FIX: Hide search bar on small screens, adjust width on others --- */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-red-400">
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 text-sm focus:outline-none focus:bg-red-50 transition-colors">
                <option value="movie">Movies</option>
                <option value="theater">Theaters</option>
              </select>
              <input type="text" placeholder={`Search...`} className="px-4 py-2 w-48 lg:w-80 bg-transparent focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400" value={searchQuery} onChange={handleSearchChange}/>
            </div>
            <button type="submit" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">
              Search
            </button>
            <SearchErrorAlert />
          </form>
        </div>

        {/* --- FIX: Desktop navigation links --- */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {isLoggedIn ? (
            <>
              {userRole === "ADMIN" && (<Link to="/admin/dashboard" className="text-gray-700 cursor-pointer hover:text-red-500 font-semibold transition-colors">Dashboard</Link>)}
              <span className="text-gray-700 cursor-pointer hover:text-red-500 font-medium px-3 py-1 rounded-lg bg-white/60 shadow-sm transition-all border border-gray-100" onClick={() => setShowLocationModal(true)}>{city} <span className="ml-1">▼</span></span>
              <span onClick={handleProfile} className="text-gray-700 cursor-pointer hover:text-red-500 font-semibold px-3 py-1 rounded-lg transition-colors bg-white/60 shadow-sm border border-gray-100">{username}</span>
              <button onClick={handleLogout} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">Logout</button>
            </>
          ) : (
            <>
              <span className="text-gray-700 cursor-pointer hover:text-red-500 font-medium px-3 py-1 rounded-lg bg-white/60 shadow-sm transition-all border border-gray-100" onClick={() => setShowLocationModal(true)}>{city} <span className="ml-1">▼</span></span>
              <Link to="/login" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 hover:scale-105 transition-all font-semibold">Login</Link>
              <Link to="/signup" className="bg-gray-100 text-gray-800 px-5 py-2 rounded-xl shadow-md hover:bg-gray-200 hover:scale-105 transition-all font-semibold">Sign Up</Link>
            </>
          )}
        </div>

        {/* --- FIX: Hamburger menu button for mobile --- */}
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-red-500 focus:outline-none">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>
        </div>
      </nav>

      {/* --- FIX: Mobile Menu Panel --- */}
      <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden transition-transform duration-300 ease-in-out z-20 ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
        <div className="p-6 space-y-6">
            {/* Search Bar for Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative flex flex-col gap-2">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-red-400">
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="px-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-r border-gray-200 text-sm focus:outline-none focus:bg-red-50 transition-colors">
                        <option value="movie">Movies</option>
                        <option value="theater">Theaters</option>
                    </select>
                    <input type="text" placeholder={`Search...`} className="px-4 py-3 w-full bg-transparent focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400" value={searchQuery} onChange={handleSearchChange}/>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl shadow-md hover:from-pink-500 hover:to-red-500 transition-all font-semibold">
                    Search
                </button>
                {searchError && (
                    <p className="text-sm text-red-600 animate-pulse text-center">{searchError}</p>
                )}
            </form>
            <hr/>
            {/* Navigation Links for Mobile */}
            <div className="flex flex-col gap-4 text-center">
                {isLoggedIn ? (
                    <>
                        {userRole === "ADMIN" && (<Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="font-semibold text-gray-700 py-2 rounded-lg hover:bg-pink-100">Dashboard</Link>)}
                        <span className="font-semibold text-gray-700 py-2 rounded-lg hover:bg-pink-100" onClick={() => {setShowLocationModal(true); setIsMenuOpen(false);}}>{city}</span>
                        <span onClick={() => {handleProfile(); setIsMenuOpen(false);}} className="font-semibold text-gray-700 py-2 rounded-lg hover:bg-pink-100">{username}</span>
                        <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold">Logout</button>
                    </>
                ) : (
                    <>
                        <span className="font-semibold text-gray-700 py-2 rounded-lg hover:bg-pink-100" onClick={() => {setShowLocationModal(true); setIsMenuOpen(false);}}>{city}</span>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold">Login</Link>
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
      </div>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectCity={(selected) => {
          setCity(selected);
          setShowLocationModal(false);
        }}
      />
    </>
  );
};

export default Navbar;
