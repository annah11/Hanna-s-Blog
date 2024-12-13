import axios from 'axios';

const Blogs = ({ blogs }) => (
  <div>
    <h1>Blogs</h1>
    <ul>
      {blogs.map(blog => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  </div>
);

export async function getServerSideProps() {
  const response = await axios.get(`${process.env.BACKEND_URL}/blogs`);
  return { props: { blogs: response.data.data } };
}

export default Blogs;
