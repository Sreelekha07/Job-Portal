import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobDetails, fetchJobs } from '../services/api'; // Ensure this API call exists
import { Button, Card, Heading } from '@chakra-ui/react';

function JobDetails() {
    const { jobId } = useParams(); // Extract jobId from the URL
    const [job, setJob] = useState(null); // State to store job details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        setLoading(true)
        const fetchAndSetJobs = async () => {
            setError('');
            try {
                const jobs = await fetchJobs(''); // Fetch all jobs initially
                setJob(jobs.find(currentJob => currentJob.id == Number(jobId)));
            } catch (error) {
                setError('Error fetching jobs. Please try again later.');
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetJobs();
    }, []);

    useEffect(() => {
        const loadJobDetails = async () => {
            try {
                const response = await fetchJobDetails(jobId); // Fetch job details based on jobId
                setJob(response.data); // Assuming response.data contains the job details
            } catch (err) {
                setError('Failed to fetch job details. Please try again later.');
                console.error('Failed to fetch job details:', err);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        loadJobDetails();
    }, [jobId]); // Run this effect when jobId changes

    if (loading) {
        return <p>Loading job details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!job) {
        return <p>Job not found.</p>;
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "82vh"
        }}>

            <div className="job-details">
                {/* <Heading fontWeight="700" size="2xl">Succesfully Applied! 🎉</Heading>
                
                <h2>{job.title}</h2>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Description:</strong> {job.description}</p>
                {job.requirements && <p><strong>Requirements:</strong> {job.requirements}</p>}
                {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                {job.postedAt && <p><strong>Posted on:</strong> {new Date(job.postedAt).toLocaleDateString()}</p>} */}
                {/* Add more job details as necessary */}
                <Card.Root margin={6} maxWidth="lg">
                    <Card.Header>
                        <Heading fontWeight="700" size="2xl">Succesfully Applied! 🎉</Heading>
                    </Card.Header>
                    <Card.Body color="fg.muted">
                        You'll be contacted soon by the employer.
                        <p style={{marginTop: "20px"}}><strong>Title:</strong> {job.title}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                    </Card.Body>

                    <Card.Footer justifyContent="flex-end">
                        <Button variant="outline">View other jobs</Button>
                    </Card.Footer>
                </Card.Root>
            </div>
        </div >
    );
}

export default JobDetails;
