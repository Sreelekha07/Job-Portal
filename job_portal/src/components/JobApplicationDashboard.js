import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationDashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/job-applications');
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications', err);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="application-dashboard">
      <h2>Your Job Applications</h2>
      {applications.length === 0 ? (
        <p>You have no applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <h3>{application.jobTitle}</h3>
              <p>Status: {application.status}</p>
              <p>Applied on: {application.dateApplied}</p>
              <button>View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplicationDashboard;
