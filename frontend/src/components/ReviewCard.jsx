import React from "react";

const ReviewCard = ({ name, date, rating, text }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex gap-4 mb-4 border border-gray-100">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center text-white text-xl font-bold">
          {name[0]}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-800">{name}</span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
          ))}
        </div>
        <div className="text-gray-700 text-sm">{text}</div>
      </div>
    </div>
  );
};

export default ReviewCard; 