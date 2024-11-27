import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationPage = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
        setError('Error fetching job details');
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      const response = await axios.post(`/api/jobs/${jobId}/apply`, formData);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError('Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div className="job-application-page">
      <h2>Apply for {job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Category:</strong> {job.category}</p>

      <form onSubmit={handleApply}>
        <div className="form-group">
          <label htmlFor="resume">Upload Resume</label>
          <input
            type="file"
            id="resume"
            onChange={handleResumeUpload}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Applying...' : 'Apply Now'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default JobApplicationPage;
