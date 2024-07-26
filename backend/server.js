// app.js.
//for documentation
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_image: { type: String },
  createdAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

// Auction Schema
const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  startingBid: Number,
  currentBid: Number,
  endDate: Date,

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
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

// Bid Schema
const bidSchema = new mongoose.Schema({
  amount: Number,
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auctionItem: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model("Bid", bidSchema);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  // console.log(req.header("Authorization"))
  const token = req.header("Authorization")?.split(" ")[1].slice(0, -1);
  console.log(token);
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, "ABB");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Register User
app.post("/api/users/register", async (req, res) => {
  const { first_name, last_name, email, password, user_image } = req.body;
  const user = new User({ first_name, last_name, email, password, user_image });
  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//register using facebook
app.post("/api/users/register/facebook", async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send("Email is required");
  }

  const { first_name, last_name, email, password, user_image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, "ABB");
      console.log(token);
      res.header("Authorization", `Bearer ${token}`).json("Bearer " + token);
    } else {
      const user = new User({ first_name, last_name, email, password });
      await user.save();
      const token = jwt.sign({ _id: user._id }, "ABB");
      console.log(token);
      res.header("Authorization", `Bearer ${token}`).json(token);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// Login User
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ _id: user._id }, "ABB");
  console.log(token);
  res.header("Authorization", `Bearer ${token}`).json("Bearer " + token);

  // res.header("Authorization", `Bearer ${token}`).send("Logged in successfully");
});

// Create Auction Item
app.post("/api/auctions", authMiddleware, async (req, res) => {
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
});

// Update Auction Item
app.put("/api/auctions/:id", authMiddleware, async (req, res) => {
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
});

// Delete Auction Item
app.delete("/api/auctions/:id", authMiddleware, async (req, res) => {
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
});

// Place Bid
app.post("/api/bids", authMiddleware, async (req, res) => {
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
});

// View Auction Items
app.get("/api/auctions", async (req, res) => {
  try {
    //in newest first order
    const auctions = await Auction.find()
      .populate("owner", "username")
      .sort({ _id: -1 });
    res.json(auctions);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.get("/api/auctions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await Auction.findById(id).populate("bids");
    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    // Fetch bids associated with the auction
    const bids = await Bid.find({ auctionItem: id });

    // Calculate minimum and maximum bid amounts
    const bidAmounts = bids.map((bid) => bid.amount);
    const minBid = bidAmounts.length ? Math.min(...bidAmounts) : null;
    const maxBid = bidAmounts.length ? Math.max(...bidAmounts) : null;

    // Calculate time remaining until auction expires
    const currentDate = new Date();
    const endDate = new Date(auction.endDate);

    const timeRemaining = endDate - currentDate; // Time remaining in milliseconds

    if (timeRemaining > 0) {
      const remainingDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); // Calculate remaining days
      const remainingHours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ); // Calculate remaining hours
      res.json({
        auction,
        bids,
        minBid,
        maxBid,
        remainingDays,
        remainingHours,
        auctionExpired: false,
      });
    } else {
      res.json({
        auction,
        bids,
        minBid,
        maxBid,
        remainingDays: 0,
        remainingHours: 0,
        auctionExpired: true,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/api/auctions/:id/reviews", authMiddleware, async (req, res) => {
  const { rating, review } = req.body;
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).send("Auction item not found");
    const reviewObj = {
      user: req.user._id,
      rating,
      review,
    };
    auction.reviews.push(reviewObj);
    await auction.save();
    res.status(201).send("Review added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// View Bid History
app.get("/api/auctions/:id/bids", async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
