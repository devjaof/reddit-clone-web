import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{fetching: fetchingLogout}, logout] = useLogoutMutation();
  const [{fetching, data}] = useMeQuery();
  let body = null;

  if (fetching) { // data is fetching
  } else if (!data?.me) { // user not logged in
    body = (
      <>
      <NextLink href='/login'>
        <Link color={'white'} mr={2}>login</Link>
      </NextLink>
      <NextLink href='/register'>
        <Link color={'white'}>register</Link>
      </NextLink>
      </>
    )
  } else { // user is logged in
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button 
          onClick={() => logout()} 
          isLoading={fetchingLogout}
          variant="link" 
          display="flex"
        >
            logout
          </Button>
      </Flex>
    )
  }

  return (
    <Flex bg='tan' padding={4}>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
}