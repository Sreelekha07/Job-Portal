import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobCard = ({ job }) => {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the job is already applied by this user (could be fetched from an API in a real-world scenario)
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    if (applications.find((application) => application.id === job.id)) {
      setApplied(true);
    }
  }, [job.id]);

  const handleApply = async () => {
    setLoading(true);
    try {
      // Assuming you have an API endpoint to apply for a job
      const response = await axios.post('/api/apply', { jobId: job.id });

      if (response.data.success) {
        // Store application data in localStorage (for demo purposes, replace with backend in real application)
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        applications.push(job);
        localStorage.setItem('applications', JSON.stringify(applications));

        setApplied(true);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
    }
    setLoading(false);
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job.id}`}>
        <h3>{job.title}</h3>
        <p>{job.company}</p>
        <p>{job.location}</p>
        <p>{job.salary}</p>
        <p>{job.description}</p> {/* Optional description */}
      </Link>
      <button onClick={handleApply} disabled={applied || loading}>
        {loading ? "Applying..." : applied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
};

export default JobCard;
