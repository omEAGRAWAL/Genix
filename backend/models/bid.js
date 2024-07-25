const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  amount: Number,
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auctionItem: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", bidSchema);
module.exports = Bid;
