import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";

import Layout from "../components/Layout";
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  if (!fetching && !data) {
    return <div>Something has failed... :/</div>;
  }

  const [, deletePost] = useDeletePostMutation();

  return (
    <Layout>
      <Flex mb={4} align="center">
        <Box ml="auto">
          <Button>
            <Link href="/create-post">New post</Link>
          </Button>
        </Box>
      </Flex>

      <Stack spacing={8} direction="column">
        {!data && fetching ? (
          <Box>loading...</Box>
        ) : (
          data?.posts.map((post) => (
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              key={post.id}
              position="relative"
            >
              <Box position="absolute" right={1} top={1}>
                <Button mr={2}>
                  <Link href="/edit-post">edit</Link>
                </Button>
                <Button
                  onClick={async () => {
                    await deletePost({ id: post.id });

                    window.location.reload();
                  }}
                >
                  delete
                </Button>
              </Box>
              <Box>
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.body}</Text>
              </Box>
            </Box>
          ))
        )}
      </Stack>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
