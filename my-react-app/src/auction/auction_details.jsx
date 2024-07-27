/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../bid/Modal";
import BiddingForm from "../bid/BiddingForm";
import NavBar from "../component_home/Nav_bar";
// import Review from "./Auction_review";

function UserProfile() {
  const [details, setDetails] = useState(null);
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [error, setError] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    fetchData(storedToken);
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setDetails(result);
      } else {
        setError("Failed to fetch auction details.");
      }
    } catch (error) {
      setError("An error occurred while fetching auction details.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to submit a review.");
      return;
    }

    const reviewData = { rating, review };
    try {
      const res = await fetch(
        `http://localhost:3000/api/auctions/reviews/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(reviewData),
        }
      );
      if (res.ok) {
        alert("Review submitted successfully!");
        setRating(1);
        setReview("");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while submitting your review.");
    }
  };

  return (
    <div className="pt-16">
      <NavBar />
      <div className="main_body flex flex-col md:flex-row">
        <div className="left ml-16 mt-6 w-1/4">

          <a href="/"   className="text-[#1D4ED8] text-bold flex flex-row p-3">
            Back to catalog
          </a>

          {details && (
            <>
              <img
                src={details.auction.image}
                alt=""
                className="w-60 h-46 border-1 rounded-md pt-9"
              />
              <h1 className="text-lg font-bold">Bid</h1>
              <p className="pt-8">Current bid: {details.auction.currentBid}</p>
              <p>Minimum bid: {details.auction.minimumBid}</p>
              <input
                type="text"
                placeholder="Enter your bid"
                className="border-1 rounded-md p-2 w-60"
              />
              <button className="bg-[#1D4ED8] text-white p-2 rounded-md w-60 mt-4">
                Place bid
              </button>
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="middle m-12 w-1/2">
          <h1 className="text-lg font-bold">Description</h1>
          <p className="pt-8">{details?.auction.description}</p>

          <div className="w-1/2 pt-28 ">
            <form onSubmit={submitReview}>
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
                  onChange={(e) => setRating(e.target.value)}
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
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md w-60"
              >
                Submit Review
              </button>
            </form>

            <div className="mt-8">
              {details?.auction.reviews.map((review) => (
                <div key={review._id} className="border-1 rounded-md p-2 mt-4">
                  <p className="font-bold">Rating: {review.rating}</p>
                  <p>Comment: {review.review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="Right">
          {details?.bids.map((bid) => (
            <div key={bid._id} className="border-1 rounded-md p-2 mt-4">
              <p className="font-bold">Bidder: {bid.bidder}</p>
              <p>Bid amount: {bid.amount}</p>
            </div>
          ))}
          <div className="min-h-screen flex items-center justify-center">
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Place a Bid
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <BiddingForm
                minimumBid={details?.auction.minimumBid}
                currentBid={details?.auction.currentBid}
                id={details?.auction._id}
                timeRemaining={details?.auction.timeRemaining}
                onClose={closeModal}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
