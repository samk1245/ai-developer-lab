const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      tenantId: user.tenantId,
      role: user.role
    },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "7d" }
  );

exports.register = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;

    if (!name || !email || !password || !tenantId)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing)
      return res.status(409).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      tenantId,
      role: "user"
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    res.json({
      success: true,
      message: "Login successful",
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
