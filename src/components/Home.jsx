import React from 'react';

function Home({ session }) {
  return (
    <div>
      <h2>Home</h2>
      {session ? (
        <p>Welcome, you are logged in!</p>
      ) : (
        <p>Please login or signup.</p>
      )}
    </div>
  );
}

export default Home;
