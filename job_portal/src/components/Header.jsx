import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Flex, Heading, Link, Button, Spacer } from "@chakra-ui/react";
import { Toaster, toaster } from "../components/ui/toaster"

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);

    const handleAuthChange = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_type");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
    setTimeout(() => {
      navigate("/login");
    }, 1);
  };

  return (
    <Box as="header" py={4} px={8}
      borderBottomWidth="1px"
      borderColor="border.disabled"
      color="fg.disabled">
        <Toaster />
      <Flex align="center">
        <Heading fontWeight="800" size="3xl">
          Job Portal
        </Heading>
        <Spacer />
        <Flex align="center" gap={4}>
          {!isAuthenticated ? (
            <>
              <Link as={RouterLink} to="/signup">
                <Button colorScheme="teal" variant="outline">
                  Sign Up
                </Button>
              </Link>
              <Link as={RouterLink} to="/login">
                <Button colorScheme="teal" variant="outline">
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/">
                <Button colorScheme="teal" variant="outline">
                  Home
                </Button>
              </Link>
              <Link as={RouterLink} to="/categories">
                <Button colorScheme="teal" variant="outline">
                  Categories
                </Button>
              </Link>
              <Button colorScheme="teal" variant="solid" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Header;