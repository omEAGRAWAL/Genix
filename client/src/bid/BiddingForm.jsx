/* eslint-disable react/prop-types */
import { useState } from "react";

const BiddingForm = ({
  minBid,
  currentBid,
  id,
  remainingDays,
  remainingHours,
  remainingMinutes,
  onClose,
}) => {
  const [straightBid, setStraightBid] = useState(currentBid);

  const handleStraightBidChange = (e) => setStraightBid(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!straightBid || parseFloat(straightBid) < minBid) {
      alert("Please enter a valid bid amount above the minimum bid.");
      return;
    }

    try {
      const response = await fetch(`/api/bids/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Ensure the token is properly formatted
        },
        body: JSON.stringify({ amount: straightBid }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bid placed successfully:", data);
        alert("Bid submitted successfully!");
        if (onClose) onClose(); // Close the modal if onClose is provided
      } else {
        try {
          // Attempt to parse response as JSON
          const error = await response.json();
          alert(`Bid submission failed: ${error.message}`);
          console.log("Bid submission failed:", error);
        } catch (parseError) {
          // Fallback if the response is not JSON
          const textError = await response.text();
          alert(`Bid submission failed: ${textError}`);
          console.log("Bid submission failed, raw response:", textError);
        }
      }
    } catch (error) {
      alert(`An error occurred while submitting your bid: ${error.message}`);
      console.log("Error submitting bid:", error);
    }
  };

  return (
    <div className="w-72 h-80 p-6 bg-white shadow-xl  rounded-lg">
      <div className="mb-4 ">
        <h2 className="text-xl font-semibold">Submit Bid</h2>
        <h3 className="text-sm text-gray-600">Sony Black Headphones</h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          <span>Straight bid</span>
          <input
            type="number"
            value={straightBid + 1}
            onChange={handleStraightBidChange}
            placeholder="$"
            className="mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
        <div className="text-sm">
          <div className="flex flex-row justify-between ">
            <p>Minimum Bid:</p>
            <p className="font-semibold">{minBid}</p>
          </div>
          <div className="flex flex-row justify-between ">
            <p>Current Bid:</p>
            <p className="font-semibold">{currentBid}</p>
          </div>

          <p className="text-sm">
            Ends in: {remainingDays} Days {remainingHours} Hours{" "}
            {remainingMinutes} minutes
          </p>
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
