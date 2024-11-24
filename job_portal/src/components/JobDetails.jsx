import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobDetails } from '../services/api'; // Ensure this API call exists

function JobDetails() {
    const { jobId } = useParams(); // Extract jobId from the URL
    const [job, setJob] = useState(null); // State to store job details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

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
        <div className="job-details">
            <h2>{job.title}</h2>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            {job.requirements && <p><strong>Requirements:</strong> {job.requirements}</p>}
            {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
            {job.postedAt && <p><strong>Posted on:</strong> {new Date(job.postedAt).toLocaleDateString()}</p>}
            {/* Add more job details as necessary */}
        </div>
    );
}

export default JobDetails;
