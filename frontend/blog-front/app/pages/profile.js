// pages/profile.js
import React from 'react';
import { getSession } from 'next-auth/react';

const Profile = ({ user }) => {
  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin', // redirect if not authenticated
        permanent: false,
      },
    };
  }

  // Pass user data to the page
  return {
    props: {
      user: session.user,
    },
  };
}

export default Profile;
