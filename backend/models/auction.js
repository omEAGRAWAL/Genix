const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  startingBid: Number,
  currentBid: Number,
  endDate: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ended: { type: Boolean, default: false },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String, required: true },
    },
  ],
});

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction;
