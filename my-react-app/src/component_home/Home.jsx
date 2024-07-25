/* eslint-disable no-unused-vars */
import Nav_bar from "./Nav_bar";
import Auction_card from "../auction/Auction_card";
import { useEffect, useState } from "react";

function Home() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/auctions`);
        if (response.ok) {
          const result = await response.json();
          setDetails(result);
        } else {
          setError("Error fetching data");
        }
      } catch (error) {
        setError("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Nav_bar />
      <div className=" flex max-w-100vw ">
        <div className="p-6 flex">
          {details &&
            details.map((auction) => (
              <Auction_card key={auction._id} id={auction._id} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
