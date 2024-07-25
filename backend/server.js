// app.js

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

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
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
  const token = req.header("Authorization")?.split(" ")[1];
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
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  try {
    await user.save();
    res.status(201).send("User registered successfully");
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
  res.header("Authorization", `Bearer ${token}`).json(token);

  // res.header("Authorization", `Bearer ${token}`).send("Logged in successfully");
});

// Create Auction Item
app.post("/api/auctions", async (req, res) => {
  const { title, description, image, startingBid, endDate } = req.body;
  const auction = new Auction({
    title,
    description,
    startingBid,
    image,
    currentBid: startingBid,
    endDate,
    // owner: req.user._id,
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
    const auctions = await Auction.find().populate("owner", "username");
    res.json(auctions);
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
