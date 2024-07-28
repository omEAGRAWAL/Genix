import Nav_bar from "../component_home/Nav_bar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function My_bid() {
  const [mybids, setMybids] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch("/api/bids/mybid", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMybids(data);
        } else {
          const errorText = await response.text();
          alert(`Error: ${errorText}`);
        }
      } catch (err) {
        console.error("Error fetching bids", err);
        alert("Failed to fetch bids.");
      }
    };
    fetchBids();
  }, [token]);

  return (
    <div className="pt-16">
      <Nav_bar />
      <div className="pt-16 px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold text-center mb-6">
          My Bidding History
        </h1>
        <div className="grid gap-4">
          {mybids.length > 0 ? (
            mybids
              .filter((bid) => bid.auctionItem) // Filter out bids with null auctionItem
              .map((bid) => (
                <div
                  key={bid._id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {bid.auctionItem.title}
                  </h2>
                  <p className="text-gray-700 mb-2">Amount: ${bid.amount}</p>
                  <p
                    className={`mb-4 ${
                      bid.auctionItem.ended ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    Status: {bid.auctionItem.ended ? "Ended" : "Live"}
                  </p>
                  <button
                    onClick={() => navigate(`/auction/${bid.auctionItem._id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View Product
                  </button>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">No bids found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default My_bid;
