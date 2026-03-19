const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  const { name, email, password, university, semester } = req.body;

  // Check all required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Create new user (password is hashed in model pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    university: university || '',
    semester: semester || 1,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        semester: user.semester,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Check user exists AND password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        semester: user.semester,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
// @access  Private (requires token)
// ─────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update only provided fields
  user.name = req.body.name || user.name;
  user.university = req.body.university || user.university;
  user.semester = req.body.semester || user.semester;
  user.profilePicture = req.body.profilePicture || user.profilePicture;

  // Update password only if provided
  if (req.body.password) {
    user.password = req.body.password; // Will be hashed by pre-save hook
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      university: updatedUser.university,
      semester: updatedUser.semester,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};