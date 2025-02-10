import React, { useState } from 'react';
import './Home.css';

function Home() {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleSearch = async () => {
    // Placeholder - remove scraper call for MVP
    const mockJobs = [
      { title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', description: 'Develop software applications.', url: '#' },
      { title: 'Data Scientist', company: 'Amazon', location: 'Seattle, WA', description: 'Analyze data and build machine learning models.', url: '#' }
    ];
    setJobs(mockJobs);
  };

  return (
    <div className="home-container">
      <div className="search-bar">
        <div className="search-inputs">
          <div className="search-input-container">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="search-input-container">
            <span className="location-icon"></span>
            <input
              type="text"
              placeholder="City, state, zip code, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <button onClick={handleSearch}>Find Jobs</button>
      </div>

      <div className="results-section">
        {jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              <h3>{job.title}</h3>
            </a>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            <p className="description">{job.description}</p>
            <a href={job.url} target="_blank" rel="noopener noreferrer">
              <button>Apply</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
