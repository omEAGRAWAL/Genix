const nodemailer = require("nodemailer");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agrawalom755@gmail.com",
    pass: "lrhz rmbb icqc ojyf",
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "agrawalom755@gmail.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.placeBid = async (req, res) => {
  const { amount } = req.body;
  const auctionItemId = req.params.id;

  try {
    const auction = await Auction.findById(auctionItemId).populate({
      path: "bids",
      options: { sort: { amount: -1 } }, // Sort bids in descending order
    });

    if (!auction) return res.status(404).send("Auction item not found");
    if (!auction.ended) return res.status(400).send("Auction has ended");

    if (amount <= auction.currentBid)
      return res.status(400).send("Bid must be higher than current bid");

    // Notify the previous highest bidder
    if (auction.bids.length > 0) {
      const previousHighestBid = auction.bids[0];
      if (previousHighestBid) {
        const previousBidder = await User.findById(previousHighestBid.bidder);
        if (previousBidder && previousBidder.email) {
          sendEmail(
            previousBidder.email,
            "Outbid Notification",
            `You have been outbid in the auction for ${auction.title}. The new highest bid is $${amount}.`
          );
        }
      }
    }

    // Save the new bid and update the auction
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

exports.myBid = async (req, res) => {
  try {
    const id = req.user._id;
    const bids = await Bid.find({ bidder: id }).populate("auctionItem");
    res.json(bids);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
