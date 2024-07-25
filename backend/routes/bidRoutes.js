const express = require("express");
const router = express.Router();
const { placeBid, viewBidHistory } = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, placeBid);
router.get("/:id/bids", viewBidHistory);

module.exports = router;
