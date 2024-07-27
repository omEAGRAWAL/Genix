const Auction = require("../models/auction");
const Bid = require("../models/bid");

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
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).send("Auction item not found");
    if (auction.owner.toString() !== req.user._id)
      return res.status(403).send("Access denied");
    await auction.remove();
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

    res.json({
      auction,
      bids,
      minBid,
      maxBid,
      remainingDays,
      remainingHours,
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
