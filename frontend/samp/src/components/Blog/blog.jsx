// src/components/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../api';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch posts.');
      }
    };

    getPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
