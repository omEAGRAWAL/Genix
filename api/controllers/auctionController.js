const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");

exports.createAuction = async (req, res) => {
  const { title, description, image, startingBid, endDate } = req.body;
  const auction = new Auction({
    title,
    description,
    startingBid,
    image,
    currentBid: startingBid,
    endDate,
    owner: req.user._id,
  });
  try {
    await auction.save();
    res.status(201).send("Auction item created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).send("Auction item not found");
    if (auction.owner.toString() !== req.user._id)
      return res.status(403).send("Access denied");
    Object.assign(auction, req.body);
    await auction.save();
    res.send("Auction item updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteAuction = async (req, res) => {
  try {
    // Find and delete the auction by its ID
    const auction = await Auction.findByIdAndDelete(req.params.id);

    // Check if auction was found
    if (!auction) return res.status(404).send("Auction item not found");

    // Check if the user has permission to delete the auction
    if (auction.owner.toString() !== req.user._id)
      return res.status(403).send("Access denied");

    res.send("Auction item deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.viewAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("owner", "username")
      .sort({ _id: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.viewAuctionsMy = async (req, res) => {
  try {
    const auctions = await Auction.find({ owner: req.user._id })
      .populate("owner", "username")
      .sort({ _id: -1 });

    res.json(auctions);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.viewAuctionDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await Auction.findById(id).populate("bids");
    if (!auction) return res.status(404).send("Auction not found");

    const bids = await Bid.find({ auctionItem: id });

    const bidAmounts = bids.map((bid) => bid.amount);
    const minBid = bidAmounts.length ? Math.min(...bidAmounts) : null;
    const maxBid = bidAmounts.length ? Math.max(...bidAmounts) : null;

    const currentDate = new Date();
    const endDate = new Date(auction.endDate);
    const timeRemaining = endDate - currentDate;

    const remainingDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const remainingMinutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    res.json({
      auction,
      bids,
      minBid,
      maxBid,
      remainingDays,
      remainingHours,
      remainingMinutes,
      auctionExpired: timeRemaining <= 0,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.addReview = async (req, res) => {
  const { rating, review } = req.body;
  const auctionId = req.params.id; // Assuming the route parameter is 'id'

  try {
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).send("Auction item not found");
    }

    const reviewObj = {
      user: req.user._id,
      rating,
      review,
    };

    auction.reviews.push(reviewObj);
    await auction.save();
    res.status(201).send("Review added successfully");
  } catch (error) {
    console.error(error); // Log the full error for debugging
    res.status(400).send("An error occurred while adding the review.");
  }
};

exports.search = async function (req, res) {
  const searchString = req.params.id; // Get the search query from request parameters

  if (!searchString) {
    return res.status(400).send("Search query cannot be empty");
  }

  try {
    // Using a case-insensitive regular expression to search in title and description
    const regex = new RegExp(searchString, "i");
    const auctions = await Auction.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    });

    res.json(auctions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
