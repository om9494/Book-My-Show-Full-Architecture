import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ id, poster, title, genre, rating, year }) => (
  <Link
    to={`/movie/${id}`}
    className="block group transition-transform duration-300 hover:scale-102 hover:shadow-xl"
  >
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white/30 backdrop-blur-md border border-white/20 transition-all duration-300">
      <img
        src={poster}
        alt={title}
        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Movie details overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
        <div className="font-extrabold text-lg md:text-xl truncate drop-shadow-md mb-1">{title}</div>
        <div className="flex items-center gap-2 text-xs md:text-sm opacity-90">
          {genre && <span className="bg-pink-500/80 px-2 py-0.5 rounded-full font-semibold mr-2">{genre}</span>}
          {rating && <span className="bg-yellow-400/80 text-black px-2 py-0.5 rounded-full font-bold">★ {rating}</span>}
          {year && <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold border border-white/30">{year}</span>}
        </div>
      </div>
      {/* Decorative badge or effect */}
      {rating && (
        <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-pink-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/30">
          ★ {rating}
        </div>
      )}
    </div>
  </Link>
);

export default MovieCard;
