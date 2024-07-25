const cron = require("node-cron");
const Auction = require("../models/auction");
const Bid = require("../models/bid");
const nodemailer = require("nodemailer");

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "your_email_service", // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// This function will run every minute to check for ended auctions
cron.schedule("* * * * *", async () => {
  try {
    console.log("check completed");
    // Find auctions where the endDate is less than the current date and not yet marked as ended
    const endedAuctions = await Auction.find({
      endDate: { $lt: new Date() },
      ended: false,
    }).populate("bids");

    for (const auction of endedAuctions) {
      // Find the highest bid for the auction
      const highestBid = await Bid.findOne({ auctionItem: auction._id })
        .sort({ amount: -1 })
        .populate("bidder");

      if (highestBid) {
        // Mark the auction as ended and save the winner
        auction.ended = true;
        auction.winner = highestBid.bidder._id;
        await auction.save();

        // Notify all participants
        for (const bid of auction.bids) {
          if (bid.bidder._id.equals(highestBid.bidder._id)) {
            sendEmail(
              bid.bidder.email,
              "Congratulations!",
              "You have won the auction!"
            );
          } else {
            sendEmail(
              bid.bidder.email,
              "Auction Ended",
              "The auction has ended. You did not win."
            );
          }
        }

        console.log(
          `Auction ${auction._id} ended. Winner: ${highestBid.bidder._id}`
        );
      } else {
        // If there are no bids, still mark the auction as ended
        auction.ended = true;
        await auction.save();
        console.log(`Auction ${auction._id} ended with no bids.`);
      }
    }
  } catch (error) {
    console.error("Error processing ended auctions:", error);
  }
});
