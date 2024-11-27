import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';


const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: '',
    salary: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);  // Initial unfiltered job listings
      } catch (err) {
        console.error('Error fetching jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });

    const filtered = jobs.filter((job) => {
      let isValid = true;
      if (filters.jobType && job.type !== filters.jobType) {
        isValid = false;
      }
      if (filters.salary && job.salary > filters.salary) {
        isValid = false;
      }
      return isValid;
    });
    setFilteredJobs(filtered);
  };

  return (
    <div className="job-listing-page">
      <h2>Job Listings</h2>
      <JobFilter onFilterChange={handleFilterChange} />

      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p>No jobs found with the current filters.</p>
        ) : (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default JobListingPage;
