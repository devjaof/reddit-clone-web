import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Post,
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../generated/graphql";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";
import { InputField } from "./InputField";

type PostFormModalProps = {
  post?: Post;
  isOpen: boolean;
  onClose: () => void;
};

export const PostFormModal = ({
  isOpen,
  onClose,
  post,
}: PostFormModalProps) => {
  const router = useRouter();
  useIsAuthenticated();
  const [, createPost] = useCreatePostMutation();
  const [, updatePost] = useUpdatePostMutation();

  const [modalTitle, setModalTitle] = useState("Create post");

  useEffect(() => {
    if (post) {
      setModalTitle("Update post");
    } else {
      setModalTitle("Create post");
    }
  }, [post]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Formik
            initialValues={{ title: post?.title ?? "", body: post?.body ?? "" }}
            onSubmit={async (values) => {
              post
                ? await updatePost({
                    id: post.id,
                    title: values.title,
                    body: values.body,
                  })
                : await createPost({ input: values });

              router.reload();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="title"
                  placeholder="A relevant title here"
                  label="Title"
                />
                <Box mt={4}>
                  <InputField
                    name="body"
                    placeholder="Describe what you`re thinking..."
                    label="Body"
                    textarea={true}
                  />
                </Box>

                <Flex justifyContent="space-between">
                  <Button mt={4} onClick={onClose}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button
                    mt={4}
                    color="teal"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    <Text>Publish</Text>
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
