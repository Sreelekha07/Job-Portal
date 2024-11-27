import React, { useState, useEffect } from "react";
import { fetchJobsByCategory } from "../services/api"; // Import API service function for fetching jobs by category
import "./CategoryList.css";
import { Button, Card, For, Heading, Link, Stack } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react"

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    console.log(token)
    fetch("http://127.0.0.1:8000/api/api/categories/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
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
          console.log(data)
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
    <React.Fragment>
      <Heading fontWeight="800" size="3xl" margin={6} marginBottom={4}>
        Browse by Category
      </Heading>
      <Tabs.Root defaultValue="members">
        <Tabs.List>
          {categories.map((category, index) => (
            <Tabs.Trigger value={category.name}
              key={index}
              onClick={() => setSelectedCategory(category.name)}
            // className={
            //   selectedCategory === category.name ? "active-category" : ""
            // }
            >
              {category.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {/* <Tabs.Content value="members">Software Engineer</Tabs.Content>
        <Tabs.Content value="projects">Software Engineer</Tabs.Content> */}
      </Tabs.Root>

      <div className="categories-container">
        <div className="job-list">
          {/* Loading indicator */}
          {loading && <p>Loading jobs...</p>}
          {/* Error message */}
          {error && <p className="error-message">{error}</p>}
          {/* Jobs listing */}
          {jobs.length > 0 ? (
            <Stack gap="4" direction="row" wrap="wrap" justifyContent="center" gapX={5}>
              <For each={jobs}>
                {(variant) => (
                  <Card.Root width="sm" variant={"subtle"} key={variant.title}>
                    <Card.Body gap="2">
                      <Card.Title mb="2">{variant.title}</Card.Title>
                      <Card.Description>
                        {variant.description}
                      </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                      <Button onClick={() => window.location.href = `/job/${variant.id}`}>Apply</Button>
                    </Card.Footer>
                  </Card.Root>
                )}
              </For>
            </Stack>
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Categories;
