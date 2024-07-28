/* eslint-disable no-unused-vars */
import Nav_bar from "./Nav_bar";
import Auction_card from "../auction/Auction_card";
import { useEffect, useState } from "react";
import home from "./Asset/home.png";
import Footer from "./Footer";
function Home() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlyLive, setOnlyLive] = useState(false); // State to toggle live auctions

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/auctions`);
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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter live auctions if onlyLive is true
  const filteredDetails = onlyLive
    ? details?.filter((auction) => !auction.ended) // Assuming ended indicates if an auction has ended
    : details;

  return (
    <div>
      <Nav_bar />

      <div
        className="home flex flex-row m-20 pl-10 mt-10"
        style={{
          padding: "60px ",
        }}
      >
        <div className="font-inter">
          <div className="text-5xl text-[#0F0C29] ">
            <h1>Your Gateway</h1>
            <h1>to Extraordinary </h1>
            <h1>Finds</h1>
          </div>

          <h3 className="text-[#0F0C29] text-lg mt-2">
            Unlock deals, bid smart, and seize the moment with our online
            bidding bonanza!
          </h3>
          <br />

          <button className="bg-gradient-to-t from-[#1D4ED8] to-[#5AD7FE] p-2 text-white rounded-3xl flex items-center gap-2">
            {/* <CgPlayButtonO /> */}
            Watch Video
          </button>
        </div>
        <div className="">
          <img src={home} alt="" />
        </div>
      </div>
      <button
        onClick={() => setOnlyLive(!onlyLive)}
        className="bg-gradient-to-t from-[#1D4ED8] to-[#5AD7FE] p-2 text-white rounded-3xl mt-4 flex items-center gap-2"
      >
        {onlyLive ? "Show All Auctions" : "Show Live Auctions"}
      </button>
      <div className="flex">
        <div className="m-8 flex flex-wrap items-center justify-center">
          {filteredDetails &&
            filteredDetails.map((auction) => (
              <Auction_card key={auction._id} id={auction._id} />
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
