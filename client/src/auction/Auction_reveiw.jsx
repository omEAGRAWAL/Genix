import { useState } from "react";

// eslint-disable-next-line react/prop-types
function ReviewForm({ itemId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  console.log(itemId);

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Please provide a rating between 1 and 5 stars.");
      return;
    }

    const reviewData = { rating, comment };
    try {
      const response = await fetch(
        `http://localhost:3000/api/${itemId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (response.ok) {
        // Handle successful response (e.g., notify the user, reset the form, etc.)
        alert("Review submitted successfully!");
        setRating(0);
        setComment("");
      } else {
        // Handle errors
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-4 p-4 border rounded-md shadow"
    >
      <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating (1-5 stars)
        </label>
        <select
          id="rating"
          value={rating}
          onChange={handleRatingChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Select rating
          </option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} {value === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your comment here"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
