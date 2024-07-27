/**
 * @swagger
 * components:
 *   schemas:
 *     Auction:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - startingBid
 *         - endDate
 *         - owner
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the auction
 *         description:
 *           type: string
 *           description: The description of the auction
 *         image:
 *           type: string
 *           description: The URL of the auction image
 *         startingBid:
 *           type: number
 *           description: The starting bid amount
 *         currentBid:
 *           type: number
 *           description: The current bid amount
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date of the auction
 *         owner:
 *           type: string
 *           description: The ID of the user who created the auction
 *         ended:
 *           type: boolean
 *           description: Whether the auction has ended
 *         winner:
 *           type: string
 *           description: The ID of the user who won the auction
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user who made the review
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: The rating given by the user
 *               review:
 *                 type: string
 *                 description: The review text
 */
const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number },
  endDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
