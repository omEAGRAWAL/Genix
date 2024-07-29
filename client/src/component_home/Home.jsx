/* eslint-disable no-unused-vars */
import Nav_bar from "./Nav_bar";
import Auction_card from "../auction/Auction_card";
import { useEffect, useState } from "react";
import home from "./Asset/home.png";
import Footer from "./Footer";
import { FaRegPlayCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Home() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlyLive, setOnlyLive] = useState(false); // State to toggle live auctions
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const qValue = searchParams.get("q");

    if (qValue) {
      setQuery(qValue);
    } else {
      setQuery(""); // Clear query if no q parameter is found
    }
  }, [location]);

  const fetchData = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state

    try {
      let response = "/api/auctions";

      if (query) {
        response = await fetch(`/api/auctions/search/${query}`);
      } else {
        response = await fetch(`/api/auctions`);
      }

      if (response.ok) {
        const result = await response.json();
        setDetails(result);
      } else {
        const errorText = await response.text();
        setError(`Error fetching data: ${errorText}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

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
        className="home flex flex-row pt-20 p-8  md:m-20 md:mb-4  md:pl-10 md:mt-10"
        style={{}}
      >
        <div className="font-inter p-6">
          <div className="text-3xl md:text-5xl text-[#0F0C29]">
            <h1>Your Gateway</h1>
            <h1>to Extraordinary </h1>
            <h1>Finds</h1>
          </div>

          <h3 className="text-[#0F0C29] text-lg mt-2 md:mt-6">
            Unlock deals, bid smart, and seize the moment with our online
            bidding bonanza!
          </h3>
          <br />

          <button className="bg-gradient-to-r from-[#1D4ED8] to-[#5AD7FE] p-2 text-white rounded-3xl flex items-center gap-2">
            <FaRegPlayCircle />
            Watch Video
          </button>
        </div>
        <div className="hidden md:flex">
          <img src={home} alt="" />
        </div>
      </div>

      <div className="flex" id="home">
        <div className="m-8 mt-2 flex flex-wrap items-center  w-full justify-center ">
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
