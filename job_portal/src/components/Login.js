import React, { useState } from 'react';
import { Toaster, toaster } from "../components/ui/toaster"
import { loginUser } from '../services/api'; // Import the login function
import { useNavigate } from 'react-router-dom'; // To redirect after successful login
import { Box, Heading, Input, Button, Text, VStack, Spinner } from "@chakra-ui/react";
import { Card, createListCollection, Stack } from "@chakra-ui/react"
import { Field } from "../components/ui/field"
import './Login.css'; // Styling for the Login form
import Footer from './Footer';

const Login = () => {
  const [username, setUsername] = useState(''); // Username field
  const [password, setPassword] = useState(''); // Password field
  const [error, setError] = useState(''); // State for handling errors
  const [loading, setLoading] = useState(false); // State for handling loading state
  const navigate = useNavigate(); // Hook to navigate after successful login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the login request with username and password
      const response = await loginUser({ username, password });

      // Log the response to ensure it contains 'access' and 'refresh'
      toaster.create({
        title: `Login Successful`,
        type: 'success',
      })
      console.log("Login successful:", response);

      // Ensure that the response contains the access token
      if (response && response.access && response.refresh) {
        // Store the JWT token in localStorage
        localStorage.setItem('access_token', response.access); // Access token
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('username', response.user.username); // Store the username for future use
        localStorage.setItem('user_type', response.user.user_type); // Store the username for future use
        window.dispatchEvent(new Event('authChange'));
        // Redirect to the home page or any protected route
        navigate('/');
      } else {
        alert('Login failed: Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
      toaster.create({
        title: `Login failed. Please check your credentials.`,
        type: 'error',
      })
    }
  };

  return (
    <React.Fragment>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <Card.Root maxW="sm" width="sm">
            <Card.Header>
              <Card.Title>Log in</Card.Title>
              <Card.Description>
                Enter your credentials to log in.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full">
                {error && <Text color="red.500" mb={4}>{error}</Text>}
                <Field label="Username" >
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Password" >
                  <Input type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </Field>
              </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              <Button onClick={() => { console.log("asdasd"); navigate("/signup") }} variant="outline">Register</Button>
              <Button type="submit" colorScheme="teal" isLoading={loading}>{loading ? <Spinner size="sm" /> : "Login"}</Button>
            </Card.Footer>
          </Card.Root>
        </form>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Login;
