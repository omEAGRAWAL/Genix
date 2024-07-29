const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
  const user = new User({ first_name, last_name, email, password, image });

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
      res
        .header("Authorization", `Bearer ${token}`)
        .json({ token: token, message: "Welcome Back" });
    } else {
      const newUser = new User({
        first_name,
        last_name,
        email,
        password: 123,
        user_image,
      });
      await newUser.save();
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      res
        .header("Authorization", `Bearer ${token}`)
        .json({ token, message: "Your Password is 123 please change it" });
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

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};
// Assuming the User model is defined in models/User.js

exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, new_password, user_image } =
      req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;

    if (!password) {
      res.status(400).send("Password is required");
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(400).send("Invalid credentials");
      return;
    } else {
      user.password = new_password || user.password;
    }

    user.user_image = user_image || user.user_image;

    await user.save();
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating the user.");
  }
};
