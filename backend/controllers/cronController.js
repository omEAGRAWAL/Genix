const cron = require("node-cron");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Setup nodemailer transporter with environment variables for security
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agrawalom755@gmail.com",
    pass: "lrhz rmbb icqc ojyf",
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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

// Function to check and process ended auctions
const processEndedAuctions = async () => {
  try {
    console.log("Checking for ended auctions...");
    const endedAuctions = await Auction.find({
      endDate: { $lt: new Date() },
      ended: false,
    }).populate("bids");

    for (const auction of endedAuctions) {
      const highestBid = await Bid.findOne({ auctionItem: auction._id })
        .sort({ amount: -1 })
        .populate("bidder");

      auction.ended = true;

      if (highestBid) {
        auction.winner = highestBid.bidder._id;

        for (const bid of auction.bids) {
          const bidder_data = await User.findById(bid.bidder._id);
          const isWinner = bidder_data._id.equals(highestBid.bidder._id);
          const subject = isWinner ? "Congratulations!" : "Auction Ended";
          const text = isWinner
            ? "You have won the auction!"
            : "The auction has ended. You did not win.";
          await sendEmail(bidder_data.email, subject, text);
        }

        console.log(
          `Auction ${auction._id} ended. Winner: ${highestBid.bidder._id}`
        );
      } else {
        console.log(`Auction ${auction._id} ended with no bids.`);
      }

      await auction.save();
    }
  } catch (error) {
    console.error("Error processing ended auctions:", error);
  }
};

// Schedule the cron job
cron.schedule("* * * * *", processEndedAuctions);
