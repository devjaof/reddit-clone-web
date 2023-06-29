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
import { usePostsQuery } from "../generated/graphql";
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

  return (
    <Layout>
      <br />

      <Flex mb={4} align="center">
        <Box ml="auto">
          <Link href="/create-post">New post</Link>
        </Box>
      </Flex>

      <Stack spacing={8} direction="column">
        {!data && fetching ? (
          <Box>loading...</Box>
        ) : (
          data?.posts.map((post) => (
            <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text
                mt={4}
                style={{
                  width: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {post.body}
              </Text>
            </Box>
          ))
        )}
      </Stack>
      {data?.posts.length ? (
        <Flex my={8}>
          <Button m="auto" isLoading={fetching}>
            More...
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
