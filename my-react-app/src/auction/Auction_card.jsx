import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function BidButton({ id }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auctions/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Authorization: token, // Uncomment if you have a token
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setDetails(result);
          console.log(result);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("Error: " + error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col w-60 h-[24rem] p-2 m-9 border-red-300 border-4">
      {details ? (
        <>
          <img
            src={details.auction.image}
            alt={details.auction.title}
            className="w-full h-40 object-cover"
          />
          <div className="mt-2">
            {details.auctionExpired ? (
              <p className="bg-red-700">Auction has ended</p>
            ) : (
              <p className="bg-[#21A67A] p-1 rounded-lg items-center justify-center text-white">
                Live Auction{" "}
              </p>
            )}
            <p>{details.auctionExpired}</p>
            <h3>{details.auction.title}</h3>
            {/* <p>{details.auction.description}</p> */}
            <p>Minimum Bid: ${details.minBid}</p>
            <p>Maximum Bid: ${details.maxBid}</p>
            <p>
              End Date: Days {details.remainingDays} Hour{" "}
              {details.remainingHours}
            </p>
            <button className="bg-[#1D4ED8] text-white p-2 rounded-md w-60 mt-4 w-full">
              Buy Now
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

BidButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default BidButton;
