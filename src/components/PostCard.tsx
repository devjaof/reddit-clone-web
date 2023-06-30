import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Post, useDeletePostMutation } from "../generated/graphql";
import { PostFormModal } from "./PostFormModal";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModal = () => {
    setOpenEditModal(!openEditModal);
  };

  const [, deletePost] = useDeletePostMutation();

  const router = useRouter();

  return (
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
  );
};
