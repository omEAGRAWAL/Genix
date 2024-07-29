
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  registerFacebook,
  login,
  getUser,
  updateUser,
} = require("../controllers/userController");

router.post("/register", register);
// router.get("/", authMiddleware, sendUser);
router.post("/register/facebook", registerFacebook);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.put("/user", authMiddleware, updateUser);

module.exports = router;
