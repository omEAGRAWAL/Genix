import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function BidButton({ id }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/auctions/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: token, // Uncomment if you have a token
          },
        });
        if (response.ok) {
          const result = await response.json();
          setDetails(result);
          console.log(result);
        } else {
          setError("Failed to fetch auction details");
        }
      } catch (error) {
        setError("Error: " + error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col w-72 h-[28rem] p-3 m-4 border-gray-300 border max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {details ? (
        <>
          <img
            src={details.auction.image}
            alt={details.auction.title}
            className="w-full h-40 object-cover rounded-xl"
          />
          <div className="mt-2">
            {details.auctionExpired ? (
              <p className="bg-[#DB2721] p-1 rounded-lg text-white w-32 text-center">
                Auction Ended
              </p>
            ) : (
              <p className="bg-[#21A67A] p-1 rounded-lg text-white w-32 text-center">
                Live Auction
              </p>
            )}
            <h3 className="text-xl font-semibold p-1">
              {details.auction.title}
            </h3>
            <div className="flex flex-row p-1">
              <p className="pr-4 order-1 grow">Minimum Bid:</p>
              <h1 className="font-semibold order-2 text-xl">
                ${details.minBid || details.auction.startingBid}
              </h1>
            </div>
            <div className="flex flex-row p-1">
              <p className="pr-4 grow">Current Bid:</p>
              <h1 className="font-semibold text-xl ">
                ${details.maxBid || details.auction.currentBid}
              </h1>
            </div>

            {!details.auctionExpired ? (
              <p className="p-1 text-sm  ">
                Ends in: {details.remainingDays} Days {details.remainingHours}{" "}
                Hours {details.remainingMinutes} Minutes
              </p>
            ) : (
              <div className=" text-lg text-red-600 font-semibold">
                Auction Ended
              </div>
            )}
            <button
              className="bg-gradient-to-r font-bold text-lg from-[#DB2721] to-[#5AD7FE] text-white p-2 rounded-md mt-4 w-full"
              onClick={() => handleClick(details.auction._id)}
            >
              {details.auctionExpired ? "View Auction" : "Place Bid"}
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
