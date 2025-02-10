import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CompanyInsights from './components/CompanyInsights';
import Home from './components/Home'; // Import the Home component

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="logo">JobAI</div>
          <div className="nav-links">
            {session && <Link to="/">Home</Link>}
            {session && <Link to="/company-insights">Company Insights</Link>}
          </div>
          <div className="auth-links">
            {session ? (
              <button onClick={async () => {
                if (supabase) {
                  await supabase.auth.signOut();
                }
              }}>Sign Out</button>
            ) : (
              <>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
            <span className="separator"></span>
            <a href="#">Employers / Post Job</a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={session ? <Home /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={session ? <Navigate to="/" /> : (supabase ? <SignIn supabase={supabase} /> : <div>Supabase not initialized</div>)} />
          <Route path="/signup" element={session ? <Navigate to="/" /> : (supabase ? <SignUp supabase={supabase} /> : <div>Supabase not initialized</div>)} />
          <Route path="/company-insights" element={session ? <CompanyInsights /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
