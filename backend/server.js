require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { authRouter, authenticateToken } = require('./authServer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGO_URI || "mongodb+srv://hanamesfin:hana1996@test-pro.7sydj.mongodb.net/test-pro?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  date: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 }, 
  title: String,
  description: String,
  author: String,
  date: { type: Date, default: Date.now }
});

PostSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

BlogSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

const Post = mongoose.model('Post', PostSchema);
const Blog = mongoose.model('Blog', BlogSchema);

app.use('/auth', authRouter);

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/posts', async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newPost = new Post({ title, description, author });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      message: "Blogs fetched successfully",
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
        success: false,
        data: null
      });
    }
    res.status(200).json({
      message: "Blog fetched successfully",
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
});

app.post('/blogs', authenticateToken, async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
      data: null
    });
  }

  try {
    const newBlog = new Blog({ title, description, author });
    const savedBlog = await newBlog.save();
    res.status(201).json({
      message: "Blog created successfully",
      success: true,
      data: savedBlog
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      data: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
