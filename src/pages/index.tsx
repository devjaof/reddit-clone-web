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
import { useState } from "react";
import { PostFormModal } from "../components/PostFormModal";

import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { PostCard } from "../components/PostCard";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 50,
    },
  });

  if (!fetching && !data) {
    return <div>Something has failed... :/</div>;
  }

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleCreateModal = () => {
    setOpenCreateModal(!openCreateModal);
  };

  return (
    <Layout>
      <Flex mb={4} align="center">
        <Box ml="auto">
          <Button onClick={handleCreateModal}>New post</Button>
        </Box>
      </Flex>

      <Stack spacing={8} direction="column">
        {!data && fetching ? (
          <Box>loading...</Box>
        ) : (
          data?.posts.map((post) => <PostCard post={post} />)
        )}
      </Stack>
      <PostFormModal isOpen={openCreateModal} onClose={handleCreateModal} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
