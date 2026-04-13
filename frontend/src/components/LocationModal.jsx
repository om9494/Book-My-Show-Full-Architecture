import React, { useState, useEffect } from "react";

const cities = [
  { name: "Mumbai", icon: "🏙️" },
  { name: "Delhi-NCR", icon: "🏛️" },
  { name: "Bengaluru", icon: "🏢" },
  { name: "Hyderabad", icon: "🏯" },
  { name: "Chandigarh", icon: "🏰" },
  { name: "Ahmedabad", icon: "🏟️" },
  { name: "Chennai", icon: "🏗️" },
  { name: "Pune", icon: "🏯", highlight: true },
  { name: "Kolkata", icon: "🏛️" },
  { name: "Kochi", icon: "🏝️" },
];

const LocationModal = ({ isOpen, onClose, onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const handleCitySelect = (cityName) => {
    // Store the selected city in localStorage
    localStorage.setItem("city", cityName);
    
    // Call the parent's onSelectCity function
    onSelectCity(cityName);
    
    // Close the modal
    onClose();
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, we'll just show a message that location detection is not fully implemented
          // In a real app, you would reverse geocode the coordinates to get the city name
          alert("Location detection feature is not fully implemented. Please select a city manually.");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to detect your location. Please select a city manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser. Please select a city manually.");
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 via-pink-100/30 to-blue-100/30 backdrop-blur-sm">
      <div className="bg-white/80 rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative border-t-8 border-red-400/60 backdrop-blur-md animate-fadeIn">
        <button
          className="absolute top-3 right-6 text-3xl text-gray-400 hover:text-red-500 transition-colors font-bold focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <input
          type="text"
          placeholder="Search for your city"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 px-5 py-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-400 text-lg bg-white/70 shadow-sm placeholder-gray-400"
        />
        <div 
          className="text-red-500 flex items-center gap-2 mb-6 cursor-pointer hover:text-red-600 transition-colors text-lg font-semibold select-none"
          onClick={handleDetectLocation}
        >
          <span className="text-2xl">📍</span> Detect my location
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <div className="font-semibold mb-4 text-gray-700 text-lg">Popular Cities</div>
            {filteredCities.length > 0 ? (
              <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    className={`flex flex-col items-center cursor-pointer transition-all hover:scale-110 hover:text-red-500 active:scale-95 select-none ${city.highlight ? "text-cyan-600" : "text-gray-700"}`}
                    onClick={() => handleCitySelect(city.name)}
                  >
                    <span className="text-5xl mb-2 drop-shadow-lg">{city.icon}</span>
                    <span className="text-base font-semibold bg-white/70 px-3 py-1 rounded-lg shadow-sm border border-gray-100">{city.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No cities found matching "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            )}
            <div className="text-center mt-6">
              <button className="text-pink-600 font-semibold hover:underline underline-offset-4 transition-colors text-base">View All Cities</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 