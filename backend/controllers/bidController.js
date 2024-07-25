const Auction = require("../models/auction");
const Bid = require("../models/bid");

exports.placeBid = async (req, res) => {
  const { amount, auctionItemId } = req.body;
  try {
    const auction = await Auction.findById(auctionItemId);
    if (!auction) return res.status(404).send("Auction item not found");
    if (amount <= auction.currentBid)
      return res.status(400).send("Bid must be higher than current bid");

    auction.currentBid = amount;
    const bid = new Bid({
      amount,
      bidder: req.user._id,
      auctionItem: auction._id,
    });
    await bid.save();
    auction.bids.push(bid);
    await auction.save();
    res.status(201).send("Bid placed successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.viewBidHistory = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate({
      path: "bids",
      populate: { path: "bidder", select: "username" },
    });
    if (!auction) return res.status(404).send("Auction item not found");
    res.json(auction.bids);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
