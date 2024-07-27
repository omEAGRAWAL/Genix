const cron = require("node-cron");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Setup nodemailer transporter with environment variables for security
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agrawalom755@gmail.com", // replace with your email
    pass: "lrhz rmbb icqc ojyf", // replace with your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "agrawalom755@gmail.com", // replace with your email
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
    }).populate("bids owner");

    for (const auction of endedAuctions) {
      const highestBid = await Bid.findOne({ auctionItem: auction._id })
        .sort({ amount: -1 })
        .populate("bidder");

      auction.ended = true;

      if (highestBid) {
        auction.winner = highestBid.bidder._id;

        // Notify the auction owner about the winner
        const ownerEmail = auction.owner.email;
        const ownerSubject = "Auction Ended - Winner Details";
        const ownerText = `
          The auction for "${auction.title}" has ended.
          Winner: ${highestBid.bidder.email}
          Winning Bid: $${highestBid.amount}
        `;
        await sendEmail(ownerEmail, ownerSubject, ownerText);

        // Notify bidders about the auction result
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
        // Notify the auction owner that no bids were placed
        const ownerEmail = auction.owner.email;
        const ownerSubject = "Auction Ended - No Bids";
        const ownerText = `The auction for "${auction.title}" has ended with no bids placed.`;
        await sendEmail(ownerEmail, ownerSubject, ownerText);

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
