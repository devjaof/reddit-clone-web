import { Box } from '@chakra-ui/react';
import React from 'react'

interface WrapperProps {
  children?: any;
  variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant }) => {
    return (
      <Box maxW={variant === "regular" ? "800px" : "400px"} w="100%" mt={8} mx="auto">
        { children }
      </Box>
    );
}