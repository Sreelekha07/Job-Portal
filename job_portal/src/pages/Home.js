import React, { useState } from 'react';
import { fetchJobs } from '../services/api'; // Import the fetchJobs function from api.js
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to fetch job listings based on search query
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const jobs = await fetchJobs(searchQuery); // Fetch jobs using the API service function
      setJobList(jobs); // Update jobList with the fetched data
    } catch (error) {
      setError('Error fetching jobs. Please try again later.');
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>Welcome to the Job Portal</h2>
        <p>Find your next career opportunity with us.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, skills, or companies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      <section className="featured-jobs">
        <h3>Featured Jobs</h3>
        {loading && <p>Loading jobs...</p>}
        {error && <p>{error}</p>}
        {jobList.length > 0 ? (
          jobList.map((job) => (
            <div className="job-card" key={job.id}>
              <h4>{job.title}</h4>
              <p>{job.company} - {job.location}</p>
              <button onClick={() => window.location.href = `/categories/${job.category_id}/jobs/${job.id}`}>Apply Now</button>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
