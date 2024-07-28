/* eslint-disable react/prop-types */
// import React from "react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`cursor-pointer text-2xl ${
            value <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(value)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
