import axios from 'axios';

const API_URL = "http://localhost:8000/api"; // Ensure the URL matches your backend setup

// Helper function to get token from localStorage
const getToken = () => {
  const token = localStorage.getItem('access_token');
  return token;
};

// Helper function to decode JWT token and check if expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode token (base64)
  return decodedToken.exp * 1000 < Date.now();  // Check if token is expired (exp is in seconds)
};

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register/`, userData);
    console.log("Registration Response:", response); // Log the full response for debugging
    return response.data;  // Return the data (e.g., success message or user data)
  } catch (error) {
    if (error.response) {
      console.error('Error registering user:', error.response.data);
      throw new Error(error.response.data.detail || 'An error occurred while registering the user.');
    } else {
      console.error('Error registering user:', error.message);
      throw new Error(error.message || 'An unknown error occurred.');
    }
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/`, credentials);
    console.log("Login Response:", response); // Log the full response for debugging
    localStorage.setItem('access_token', response.data.access); // Store token for future requests
    return response.data;  // Return the data (tokens, user data, etc.)
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message);  // Propagate error
  }
};

// Fetch Jobs (with token validation)
export const fetchJobs = async () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error("Authentication token is missing or expired.");
  }

  try {
    const response = await axios.get(`${API_URL}/jobs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;  // Assuming backend returns an array of jobs
  } catch (error) {
    console.error('Error fetching jobs:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message);  // Propagate error
  }
};


export const fetchJobsByCategory = (category) => {
  return fetch(`http://127.0.0.1:8000/api/jobs?category=${category}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

// Fetch Job Details by ID (with token validation)
export const fetchJobDetails = async (jobId) => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error("Authentication token is missing or expired.");
  }

  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming backend returns job details
  } catch (error) {
    console.error('Error fetching job details:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message); // Propagate error
  }
};

// Post a Job (with token authentication)
export const postJob = async (jobData) => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error("Authentication token is missing or expired.");
  }

  try {
    const response = await axios.post(`${API_URL}/jobs/`, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Ensure the Content-Type is set to JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting job:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data : error.message); // Propagate error
  }
};

// Optional: Function to clear token from localStorage (e.g., when logging out)
export const clearToken = () => {
  localStorage.removeItem('access_token');
};
