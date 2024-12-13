require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { registerSchema, loginSchema } = require('./validation');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined. Check your .env file.");
}

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const authRouter = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized', success: false, data: null });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden', success: false, data: null });
    }
    req.user = user;
    next();
  });
};

authRouter.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message, success: false });
  }

  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", success: true });
  } catch (err) {
    res.status(500).json({
      message: err.code === 11000 ? "Username or email already exists" : err.message,
    });
  }
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required', success: false, data: null });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password', success: false, data: null });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password', success: false, data: null });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', success: true, data: { token } });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false, data: null });
  }
});

authRouter.get('/whoami', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false, data: null });
    }
    res.status(200).json({ message: 'User fetched successfully', success: true, data: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false, data: null });
  }
});

module.exports = { authRouter, authenticateToken };
