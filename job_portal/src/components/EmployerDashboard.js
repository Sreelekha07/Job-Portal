import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/employer-jobs');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="employer-dashboard">
      <h2>Your Job Listings</h2>
      {jobs.length === 0 ? (
        <p>You have no job listings yet.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerDashboard;
