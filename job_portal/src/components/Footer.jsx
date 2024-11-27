import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Text, Link, VStack, HStack } from '@chakra-ui/react';
import './Footer.css';

function Footer() {
    return (
        <Box as="footer" py={4} color="white" borderTopWidth="1px"
            borderColor="border.disabled">
            <VStack spacing={4}>
                <Text fontWeight="300">© 2024 Job Portal. All rights reserved.</Text>
                <HStack spacing={4}>
                    <Link as={RouterLink} to="/privacy-policy" _hover={{ textDecoration: 'underline' }}>
                        Privacy Policy
                    </Link>
                    <Link as={RouterLink} to="/contact" _hover={{ textDecoration: 'underline' }}>
                        Contact Us
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
}

export default Footer;
