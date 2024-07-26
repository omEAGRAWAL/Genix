/**
 * @swagger
 * components:
 *   schemas:
 *     Bid:
 *       type: object
 *       required:
 *         - amount
 *         - bidder
 *         - auctionItem
 *       properties:
 *         amount:
 *           type: number
 *           description: The bid amount
 *         bidder:
 *           type: string
 *           description: The ID of the user who placed the bid
 *         auctionItem:
 *           type: string
 *           description: The ID of the auction item
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the bid was placed
 */
const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  amount: Number,
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auctionItem: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", bidSchema);
module.exports = Bid;
