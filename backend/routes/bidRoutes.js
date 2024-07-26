const express = require("express");
const router = express.Router();
const { placeBid, viewBidHistory } = require("../controllers/bidController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:id", authMiddleware, placeBid);
router.get("/:id/bids", viewBidHistory);

module.exports = router;
/**
 * @swagger
 * /bids/{id}:
 *   post:
 *     summary: Place a new bid
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The auction item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the bid
 *                 example: 100
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /bids/{id}/bids:
 *   get:
 *     summary: Get bid history for an auction
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The auction item ID
 *     responses:
 *       200:
 *         description: A list of bids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bid'
 *       404:
 *         description: Auction item not found
 */
