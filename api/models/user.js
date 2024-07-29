/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         user_image:
 *           type: string
 *         createdAuctions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Auction'
 *         bids:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Bid'
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  
  password: { type: String, required: true },
  user_image: {
    type: String,
    default: "https://www.gravatar.com/avatar/",
  },
  createdAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
