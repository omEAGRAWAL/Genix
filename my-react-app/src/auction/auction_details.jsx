/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Modal from "../bid/Modal";
import BiddingForm from "../bid/BiddingForm";

import Nav_bar from "../component_home/Nav_bar";
import { MdKeyboardArrowLeft } from "react-icons/md";

function UserProfile() {
  const [details, setDetails] = useState(null);
  const [token, setToken] = useState("");

  const { id } = useParams();

  //modal opening for bidding form
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch_data();
  }, []);

  const fetch_data = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("User data:", result);
        console.log(result);
        setDetails(result);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Extract the `id` parameter from the URL

  return (
    <div>
      <Nav_bar />
      <div className=" main_body flex flex-col md:flex-row">
        <div className="left ml-16 mt-6 w-1/4">
          <button className="text-[#1D4ED8] text-bold flex flex-row p-3">
            <MdKeyboardArrowLeft color="#1D4ED8" />
            Back to catalog
          </button>

          <img
            src={details?.auction.image}
            alt=""
            className="w-60 h-46 border-1 rounded-md pt-9"
          />
          <h1 className="text-lg/[21.86px] font-bold">Bid</h1>
          <p className="pt-8">Current bid: {details?.auction.current_bid}</p>
          <p>Minimum bid: {details?.auction.minimum_bid}</p>
          <input
            type="text"
            placeholder="Enter your bid"
            className="border-1 rounded-md p-2 w-60"
          />
          <button className="bg-[#1D4ED8] text-white p-2 rounded-md w-60 mt-4">
            Place bid
          </button>
        </div>
        <div className="middle m-12 w-1/2">
          <h1 className="text-lg/[21.86px] font-bold">Description</h1>
          <p className="pt-8">{details?.auction.description}</p>
        </div>
        <div className="Right w-1/4">
          {/* //list all the bids  */}
          {details?.bids.map((bid) => (
            <div key={bid._id} className="border-1 rounded-md p-2 mt-4">
              <p className="font-bold">Bidder: {bid.bidder}</p>
              <p>Bid amount: {bid.amount}</p>
            </div>
          ))}

          <div>
            <div className="min-h-screen flex items-center justify-center">
              <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Place a Bid
              </button>

              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <BiddingForm
                  // minimumBid={details?.auction.minimum_bid}
                  currentBid={details?.auction.current_bid}
                  id={details?.auction._id}
                  timeRemaining={1}
                  onClose={closeModal}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
