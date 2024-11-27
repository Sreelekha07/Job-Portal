import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../services/api'; // Import the fetchJobs function from api.js
import './Home.css';
import { Box, Button, Card, Center, Flex, For, Heading, Input, Stack } from "@chakra-ui/react"
import JobCreationForm from '../components/JobCreationForm';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState('');
  const user_type = localStorage.getItem('user_type');
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
        console.log(jobs)
      } catch (error) {
        setError('Error fetching jobs. Please try again later.');
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetJobs();
  }, []);

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "row" }} direction="row" h="20">
        {user_type === 'employer' ? <React.Fragment>
          <Card.Root margin={6} maxWidth="lg">
            <Card.Header>
              <Heading fontWeight="700" size="2xl">Hello Recuriter👋</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              Post a job here to find the best candidates for your company.
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button variant="outline">Login as a job seeker</Button>
              <JobCreationForm />
            </Card.Footer>
          </Card.Root>
        </React.Fragment> : null}
        <Card.Root margin={6} marginLeft={0} maxWidth="lg" width="lg">
          <Card.Header>
            <Heading fontWeight="700" size="2xl">Search Jobs 🔍</Heading>
          </Card.Header>
          <Card.Body color="fg.muted">
            Search for jobs, skills, or companies.
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Input type="text"
              placeholder="Start typing here to filter jobs..."
              value={searchQuery}
              onChange={handleSearchChange} />
          </Card.Footer>
        </Card.Root>
      </div>
      <Heading fontWeight="800" size="3xl" marginLeft={10} marginBottom={3}>
        Featured Jobs
      </Heading>
      <Box width="full" borderBottomWidth="1px"
        borderColor="border.disabled"></Box>
      <section className="featured-jobs">
        {loading && <p>Loading jobs...</p>}
        {error && <p>{error}</p>}
        {filteredJobs.length > 0 ? (
          <Stack gap="4" direction="row" wrap="wrap" justifyContent="center" gapX={5}>
            <For each={filteredJobs}>
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
      </section>
    </React.Fragment>
  );
};

export default Home;
