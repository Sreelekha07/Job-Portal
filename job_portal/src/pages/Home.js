import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../services/api'; // Import the fetchJobs function from api.js
import './Home.css';
import JobCreationForm from '../components/JobCreationForm';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const user_type = localStorage.getItem('user_type');
  // const user_type = "employer";

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterJobs(query);
  };

  const filterJobs = (query) => {
    const filtered = jobList.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      job.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    const fetchAndSetJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const jobs = await fetchJobs(''); // Fetch all jobs initially
        setJobList(jobs); // Update jobList with the fetched data
        setFilteredJobs(jobs); // Initialize filteredJobs with all jobs
      } catch (error) {
        setError('Error fetching jobs. Please try again later.');
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetJobs();
  }, []);
  // Function to fetch job listings based on search query
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const jobs = await fetchJobs(searchQuery); // Fetch jobs using the API service function
      setJobList(jobs); // Update jobList with the fetched data
    } catch (error) {
      setError('Error fetching jobs. Please try again later.');
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user_type === 'employer') {
    return (
      <div className="home-container">
        <h2>Welcome to the Job Portal</h2>
        <JobCreationForm />
      </div>)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h2>Welcome to the Job Portal</h2>
        <p>Find your next career opportunity with us.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for jobs, skills, or companies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <section className="featured-jobs">
        <h3>Featured Jobs</h3>
        {loading && <p>Loading jobs...</p>}
        {error && <p>{error}</p>}
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h4>{job.title}</h4>
              <p>{job.company} - {job.location}</p>
              <button onClick={() => window.location.href = `/job/${job.id}`}>Apply Now</button>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
