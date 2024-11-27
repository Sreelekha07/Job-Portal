import React from 'react';

const JobFilter = ({ onFilterChange }) => {
  return (
    <div className="job-filter">
      <h3>Filter Jobs</h3>
      <label htmlFor="jobType">Job Type</label>
      <select id="jobType" onChange={(e) => onFilterChange('jobType', e.target.value)}>
        <option value="">All</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="internship">Internship</option>
      </select>

      <label htmlFor="salaryRange">Salary Range</label>
      <input
        type="range"
        id="salaryRange"
        min="0"
        max="100000"
        onChange={(e) => onFilterChange('salary', e.target.value)}
      />
    </div>
  );
};

export default JobFilter;
