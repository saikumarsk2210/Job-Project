import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            {session && (
              <li>
                <button onClick={async () => {
                  await supabase.auth.signOut();
                  setSession(null);
                }}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home session={session} />} />
          <Route path="/login" element={session ? <Navigate to="/" /> : <Login supabase={supabase} />} />
          <Route path="/signup" element={session ? <Navigate to="/" /> : <Signup supabase={supabase} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
