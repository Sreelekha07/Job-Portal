import React, { useState, useEffect } from "react";
import { fetchJobsByCategory } from "../services/api"; // Import API service function for fetching jobs by category
import "./CategoryList.css";

const Categories = () => {
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected category
  const [jobs, setJobs] = useState([]); // State for job listings
  const [loading, setLoading] = useState(false); // Loading state for job fetch
  const [error, setError] = useState(null); // Error state for API calls

  // Fetch categories on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/api/categories/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log("Fetched categories:", data);
        setCategories(data); // Update state with categories
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      });
  }, []);

  // Fetch jobs when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true); // Set loading state when fetching jobs
      fetchJobsByCategory(selectedCategory) // Call the API service function to fetch jobs by category
        .then((data) => {
          setJobs(data);
          setLoading(false); // Reset loading state after fetching
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
          setError("Failed to load jobs.");
          setLoading(false);
        });
    }
  }, [selectedCategory]);

  return (
    <div className="categories-container">
      <h2>Job Categories</h2>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={
              selectedCategory === category.name ? "active-category" : ""
            }
          >
            {category.name}
          </li>
        ))}
      </ul>

      <div className="job-list">
        <h3>
          {selectedCategory
            ? `Jobs in ${selectedCategory}`
            : "Select a category to see jobs"}
        </h3>

        {/* Loading indicator */}
        {loading && <p>Loading jobs...</p>}

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Jobs listing */}
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job) => (
              <li key={job.id} className="job-item">
                <h4>{job.title}</h4>
                <p>
                  {job.company} - {job.location}
                </p>
                <button onClick={() => window.location.href = `/job/${job.id}`}>Apply Now</button>
              </li>
            ))}
          </ul>
        ) : (
          selectedCategory && !loading && (
            <p>No jobs available in this category.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Categories;
