export async function getServerSideProps() {
    const response = await axios.get(`${process.env.BACKEND_URL}/posts`);
    return { props: { posts: response.data } };
  }
  