/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../bid/Modal";
import BiddingForm from "../bid/BiddingForm";
import Nav_bar from "../component_home/Nav_bar";
import Reveiw from "./Auction_reveiw";

function UserProfile() {
  const [details, setDetails] = useState(null);
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null); // Added for error handling

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetch_data(token);
  }, []);

  const fetch_data = async (token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Assuming JWT token
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setDetails(result);
      } else {
        setError("Failed to fetch auction details.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching auction details.");
    }
  };

  const submitReveiw = async (e) => {
    e.preventDefault();
    console.log("Review submitted");

    const reviewData = { rating, review };
    // Send review
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Include token for authenticated request
        },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setRating(0);
        setReview("");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting your review.");
    }
  };

  return (
    <div className="pt-16">
      <Nav_bar />
      <div className="main_body flex flex-col md:flex-row">
        <div className="left ml-16 mt-6 w-1/4">
          <button className="text-[#1D4ED8] text-bold flex flex-row p-3">
            {/* <MdKeyboardArrowLeft color="#1D4ED8" /> */}
            Back to catalog
          </button>

          {details && (
            <>
              <img
                src={details.auction.image}
                alt=""
                className="w-60 h-46 border-1 rounded-md pt-9"
              />
              <h1 className="text-lg font-bold">Bid</h1>
              <p className="pt-8">Current bid: {details.auction.current_bid}</p>
              <p>Minimum bid: {details.auction.minimum_bid}</p>
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
          {/* <Reveiw itemId={id} /> */}

          <form onSubmit={submitReveiw}>
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
          <div>
            {/* {details?.auction.reveiws.map((reveiws) => console.log(reveiws))} */}
          </div>

          <div className="mt-8">
            <h1 className="text-lg font-bold">Reviews</h1>
            <div className="border-1 rounded-md p-2 mt-4">
              <p className="font-bold">User 1</p>
              <p>Rating: {/* dynamic rating */}</p>
              <p>Review: This is a great product</p>
            </div>
            <div className="border-1 rounded-md p-2 mt-4">
              <p className="font-bold">User 2</p>
              <p>Rating: 4</p>
              <p>Review: This is a good product</p>
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
                minimumBid={details?.auction.minimum_bid}
                currentBid={details?.auction.current_bid}
                id={details?.auction._id}
                timeRemaining={details?.auction.time_remaining}
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
