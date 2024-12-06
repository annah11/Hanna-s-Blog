const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

mongoose.connect(
  "mongodb+srv://hanamesfin:hana1996@test-pro.7sydj.mongodb.net/test-pro?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

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

app.put('/posts/:id', async (req, res) => {
  const { title, description, author } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, author },
      { new: true }
    );

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/blogs', async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBlog = new Blog({ title, description, author });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/blogs/:id', async (req, res) => {
  const { title, description, author } = req.body;

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { id: req.params.id },
      { title, description, author },
      { new: true }
    );

    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ id: req.params.id });
    if (deletedBlog) {
      res.status(200).json({ message: "Blog deleted successfully" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
