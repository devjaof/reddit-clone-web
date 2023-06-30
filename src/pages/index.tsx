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
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRouter } from "next/router";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 50,
    },
  });

  if (!fetching && !data) {
    return <div>Something has failed... :/</div>;
  }

  const router = useRouter();

  const [, deletePost] = useDeletePostMutation();

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModal = () => {
    setOpenEditModal(!openEditModal);
  };

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
          data?.posts.map((post) => (
            <>
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                key={post.id}
                position="relative"
              >
                <Box position="absolute" right={1} top={1}>
                  <Button mr={2} onClick={handleEditModal}>
                    <Text>edit</Text>
                  </Button>
                  <Button
                    onClick={async () => {
                      await deletePost({ id: post.id });

                      router.reload();
                    }}
                  >
                    <Text>delete</Text>
                  </Button>
                </Box>
                <Box>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text mt={4}>{post.body}</Text>
                </Box>
              </Box>
              <PostFormModal
                key={post.id}
                isOpen={openEditModal}
                onClose={handleEditModal}
                post={post}
              />
            </>
          ))
        )}
      </Stack>
      <PostFormModal isOpen={openCreateModal} onClose={handleCreateModal} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
