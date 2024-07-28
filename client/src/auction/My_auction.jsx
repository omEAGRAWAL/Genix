import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Auction_card from "./My_auction_card"; // Adjust the path as needed
import Nav_bar from "../component_home/Nav_bar";
function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/auctions/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuctions(data);
        } else {
          const errorText = await response.text();
          setError(`Error: ${errorText}`);
        }
      } catch (err) {
        console.error("Error fetching auctions", err);
        setError("Failed to fetch auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="pt-16">
      <Nav_bar />
      <div className="max-w-4xl mx-auto m-6 md:mt-10 md:p-4 bg-white shadow-xl rounded-md pt-16">
        <h1 className="text-2xl font-semibold mb-4">My Listed Auctions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <Auction_card key={auction.id} id={auction._id} />
            ))
          ) : (
            <p>No auctions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAuctions;
