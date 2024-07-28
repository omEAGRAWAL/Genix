const express = require("express");
const router = express.Router();
const {
  placeBid,
  viewBidHistory,
  myBid,
} = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:id", authMiddleware, placeBid);
router.get("/:id/bids", viewBidHistory);
router.get("/mybid", authMiddleware, myBid);

module.exports = router;
