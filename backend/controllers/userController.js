const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, user_image } = req.body;
  const user = new User({ first_name, last_name, email, password, user_image });
  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.registerFacebook = async (req, res) => {
  if (!req.body.email) return res.status(400).send("Email is required");

  const { first_name, last_name, email, password, user_image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.header("Authorization", `Bearer ${token}`).json(token);
    } else {
      const newUser = new User({
        first_name,
        last_name,
        email,
        password,
        user_image,
      });
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      res.header("Authorization", `Bearer ${token}`).json(token);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.header("Authorization", `Bearer ${token}`).json(token);
};
