import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../components/ui/select";
import "./Signup.css";
import { Button, Card, createListCollection, Input, Stack } from "@chakra-ui/react"
import { Field } from "../components/ui/field"
import Footer from "./Footer";
import { Toaster, toaster } from "../components/ui/toaster"


const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "", // Default to job_seeker
  });
  const [userType, setUserType] = useState("job_seeker");

  const [loading, setLoading] = useState(false); // Track the loading state
  const [errors, setErrors] = useState({}); // Track errors as an object
  const navigate = useNavigate();

  // Client-side validation
  const validateForm = () => {
    let formErrors = {};
    if (!userData.username.trim()) formErrors.username = "Username is required.";
    if (!userData.email.trim()) formErrors.email = "Email is required.";
    if (!userData.password) formErrors.password = "Password is required.";
    else if (userData.password.length < 6)
      formErrors.password = "Password must be at least 6 characters.";
    return formErrors;
  };

  // Handle input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const frameworks = createListCollection({
    items: [
      { label: "Job Seeker", value: "job_seeker" },
      { label: "Employer", value: "employer" },
    ],
  })

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Reset errors before submission
    const formErrors = validateForm();
    console.log(formErrors)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return; // Prevent submission if there are validation errors
    }

    const data = {
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      user_type: typeof userType === 'string' ? userType : userType[0],
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register/",
        data
      );
      console.log("User registered successfully:", response.data);
      toaster.create({
        title: `Sign up Successful`,
        type: 'success',
      })
      navigate("/login"); // Redirect to login page on success
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);

      const responseErrors = error.response?.data || {};
      setErrors({
        username: responseErrors.username ? responseErrors.username[0] : "",
        email: responseErrors.email ? responseErrors.email[0] : "",
        password: responseErrors.password ? responseErrors.password[0] : "",
        general:
          !responseErrors.username &&
            !responseErrors.email &&
            !responseErrors.password
            ? "Error registering user"
            : "",
      });
      console.log(errors)
      toaster.create({
        title: `Sign up failed!`,
        type: 'error',
      })
    } finally {
      setLoading(false);
    }
  };

  return (<React.Fragment>
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <Card.Root width="sm" maxW="sm">
          <Card.Header>
            <Card.Title>Sign up</Card.Title>
            <Card.Description>
              Fill in the form below to create an account
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" w="full">
              {errors.general && <div className="error-message">{errors.general}</div>}
              <Field label="Username" errorText={errors.username}>
                <Input type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required />
              </Field>
              <Field label="Email" errorText={errors.email}>
                <Input type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required />
              </Field>
              <Field label="Password" errorText={errors.password}>
                <Input type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required />
              </Field>
              {/* <Field label="User type"> */}
              {/* <select
                  name="user_type"
                  value={userData.user_type}
                  onChange={handleChange}
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select> */}
              {/* </Field> */}
              <SelectRoot collection={frameworks} size="md" value={userType}
                onValueChange={(e) => { setUserType(e.value); console.log(e.value[0]) }}
              >
                <SelectLabel>User Type</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Job Seeker" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.items.map((jobtype) => (
                    <SelectItem item={jobtype} key={jobtype.value}> 
                      {jobtype.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button variant="outline" onClick={() => { console.log("asdasd"); navigate("/login") }}>I already have an account</Button>
            <Button variant="solid" type="submit">Sign Up</Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </div>
    <Footer />
  </React.Fragment>
  );
};

export default Signup;
