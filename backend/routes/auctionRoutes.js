const express = require("express");
const router = express.Router();
const {
  createAuction,
  updateAuction,
  deleteAuction,
  viewAuctions,
  viewAuctionsMy,
  viewAuctionDetails,
  addReview,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createAuction);
router.put("/:id", authMiddleware, updateAuction);
router.delete("/:id", authMiddleware, deleteAuction);
router.get("/", viewAuctions);
router.get("/my", authMiddleware, viewAuctionsMy);
router.get("/:id", viewAuctionDetails);
router.post("reviews/:id", authMiddleware, addReview);

module.exports = router;
