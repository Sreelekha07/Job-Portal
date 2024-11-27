import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobSearch = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/jobs', {
        params: { jobTitle, location, category },
      });
      setJobs(response.data);
    } catch (err) {
      setError('Error fetching job data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-search">
      <h2>Search for Jobs</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p>{error}</p>}
      {jobs.length === 0 && !loading && <p>No jobs found.</p>}

      <div>
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Category:</strong> {job.category}</p>
            <a href={`/job-details/${job.id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
