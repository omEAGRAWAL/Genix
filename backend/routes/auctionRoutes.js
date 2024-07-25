const express = require("express");
const router = express.Router();
const {
  createAuction,
  updateAuction,
  deleteAuction,
  viewAuctions,
  viewAuctionDetails,
  addReview,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createAuction);
router.put("/:id", authMiddleware, updateAuction);
router.delete("/:id", authMiddleware, deleteAuction);
router.get("/", viewAuctions);
router.get("/:id", viewAuctionDetails);
router.post("/:id/reviews", authMiddleware, addReview);

module.exports = router;
