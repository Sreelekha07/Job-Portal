import React, { useState } from 'react';
// import './PostJob.css';

const PostJob = () => {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    applicationDeadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!jobDetails.title || !jobDetails.description || !jobDetails.location || !jobDetails.applicationDeadline) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT is stored in localStorage
        },
        body: JSON.stringify(jobDetails),
      });

      if (response.ok) {
        alert('Job posted successfully!');
        setJobDetails({
          title: '',
          description: '',
          requirements: '',
          location: '',
          applicationDeadline: '',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="post-job-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={jobDetails.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={jobDetails.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="requirements"
          placeholder="Job Requirements"
          value={jobDetails.requirements}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Job Location"
          value={jobDetails.location}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="applicationDeadline"
          value={jobDetails.applicationDeadline}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
