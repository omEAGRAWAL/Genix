/* eslint-disable react/prop-types */
import { useState } from "react";

const BiddingForm = ({
  minimumBid,
  currentBid,
  id,
  timeRemaining,
  onClose,
}) => {
  const [straightBid, setStraightBid] = useState("");
  const [maxBid, setMaxBid] = useState("");

  const handleStraightBidChange = (e) => setStraightBid(e.target.value);
  const handleMaxBidChange = (e) => setMaxBid(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/bids/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ amount: straightBid }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Close modal after successful submission
        onClose();
      } else {
        // Handle errors (e.g., display a message to the user)
        const error = await response.text();
        alert(error);
        console.log("Bid submission failed:", response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(`alert ${error}`);
    }
  };

  return (
    <div className="w-80 p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Submit Bid</h2>
        <h3 className="text-sm text-gray-600">Sony Black Headphones</h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          <span>Straight bid</span>
          <input
            type="number"
            value={straightBid}
            onChange={handleStraightBidChange}
            placeholder="$"
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </label>
        <label className="flex flex-col">
          <span>Maximum bid</span>
          <input
            type="number"
            value={maxBid}
            onChange={handleMaxBidChange}
            placeholder="$"
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </label>
        <div className="text-sm">
          <p>Minimum Bid:</p>
          <p className="text-xl font-bold">${minimumBid}</p>
          <p>Current Bid: ${currentBid}</p>
          <p>Ends in: {timeRemaining}</p>
        </div>
        <button
          type="submit"
          className="w-20 py-1 bg-gradient-to-r from-[#1D4ED8] to-[#5AD7FE] text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BiddingForm;
