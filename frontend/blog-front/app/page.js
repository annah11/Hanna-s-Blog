// pages/index.js (or page.js if your project structure is different)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';

const HomePage = () => {
  const { data: session } = useSession(); // Get session info from NextAuth
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/blogs`);
        setBlogs(response.data.data);
      } catch (err) {
        setError('Error fetching blogs');
      }
    };

    if (session) {
      fetchBlogs();
    } else {
      setError('Please log in to see blogs.');
    }
  }, [session]);

  return (
    <div>
      <h1>Welcome to the Blog</h1>
      {session ? (
        <div>
          <h2>Your Blogs</h2>
          {blogs.length > 0 ? (
            <ul>
              {blogs.map(blog => (
                <li key={blog.id}>{blog.title}</li>
              ))}
            </ul>
          ) : (
            <p>No blogs available</p>
          )}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h2>Please log in</h2>
          <button onClick={() => signIn('credentials')}>Log in</button>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default HomePage;
