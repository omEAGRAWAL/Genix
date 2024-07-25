import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function BidButton({ id }) {
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = (bid) => {
    navigate(`/auction/${bid}`);
  };

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
    <div className="flex flex-col w-60 h-[24rem] p-3 m-4 border-gray-300 border max-w-sm rounded overflow-hidden shadow-lg bg-white">
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
                Auction ended
              </p>
            ) : (
              <p className="bg-[#21A67A] p-1 rounded-lg text-white w-32 text-center">
                Live Auction
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
            <button
              className="bg-gradient-to-r from-[#DB2721] to-[#5AD7FE] text-white p-2 rounded-md mt-4 w-full"
              onClick={() => handleClick(details.auction._id)} // Fix here
            >
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
