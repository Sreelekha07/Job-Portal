import React, { useEffect, useState } from 'react';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem('applications')) || [];
    setApplications(storedApplications);
  }, []);

  return (
    <div className="applications-page">
      <h2>Your Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet. Start applying for jobs!</p>
      ) : (
        <ul>
          {applications.map((job) => (
            <li key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applications;
