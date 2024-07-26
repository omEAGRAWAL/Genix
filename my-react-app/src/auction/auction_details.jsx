/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../bid/Modal";
import BiddingForm from "../bid/BiddingForm";
import Nav_bar from "../component_home/Nav_bar";
// import { MdKeyboardArrowLeft } from "react-icons/md";

function UserProfile() {
  const [details, setDetails] = useState(null);
  const [token, setToken] = useState("");
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetch_data(token);
  }, []);

  const fetch_data = async (token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming JWT token
        },
      });
      if (response.ok) {
        const result = await response.json();
        setDetails(result);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="pt-16">
      <Nav_bar />
      <div className="main_body flex flex-col md:flex-row">
        <div className="left ml-16 mt-6 w-1/4">
          <button className="text-[#1D4ED8] text-bold flex flex-row p-3">
            <MdKeyboardArrowLeft color="#1D4ED8" />
            Back to catalog
          </button>

          {details && (
            <>
              <img
                src={details.auction.image}
                alt=""
                className="w-60 h-46 border-1 rounded-md pt-9"
              />
              <h1 className="text-lg font-bold">Bid</h1>
              <p className="pt-8">Current bid: {details.auction.current_bid}</p>
              <p>Minimum bid: {details.auction.minimum_bid}</p>
              <input
                type="text"
                placeholder="Enter your bid"
                className="border-1 rounded-md p-2 w-60"
              />
              <button className="bg-[#1D4ED8] text-white p-2 rounded-md w-60 mt-4">
                Place bid
              </button>
            </>
          )}
        </div>
        <div className="middle m-12 w-1/2">
          <h1 className="text-lg font-bold">Description</h1>
          <p className="pt-8">{details?.auction.description}</p>
        </div>
        <div className="Right ">
          {details?.bids.map((bid) => (
            <div key={bid._id} className="border-1 rounded-md p-2 mt-4">
              <p className="font-bold">Bidder: {bid.bidder}</p>
              <p>Bid amount: {bid.amount}</p>
            </div>
          ))}
          <div className="min-h-screen flex items-center justify-center">
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Place a Bid
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <BiddingForm
                minimumBid={details?.auction.minimum_bid}
                currentBid={details?.auction.current_bid}
                id={details?.auction._id}
                timeRemaining={details?.auction.time_remaining}
                onClose={closeModal}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
