const express = require("express");
const router = express.Router();
const {
  register,
  registerFacebook,
  login,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/register/facebook", registerFacebook);
router.post("/login", login);

module.exports = router;
