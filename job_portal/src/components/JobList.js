import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../services/api"; // Assuming the API fetch function is properly set up

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // New category filter state

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetchJobs(); // You can modify this to pass query params for category if needed
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search query and category filter
    const filtered = jobs.filter(
      (job) =>
        (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (categoryFilter ? job.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true)
    );
    setFilteredJobs(filtered);
  }, [searchQuery, jobs, categoryFilter]); // Update filter whenever searchQuery, jobs, or categoryFilter changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value); // Handle category selection
  };

  if (loading) {
    return <p>Loading jobs...</p>; // Enhance loading state
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="job-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for jobs, skills, or companies..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button>Search</button>
      </div>

      <div className="filters">
        <select value={categoryFilter} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Software">Software</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p>No jobs found matching your criteria.</p>
      ) : (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
}

export default JobList;
