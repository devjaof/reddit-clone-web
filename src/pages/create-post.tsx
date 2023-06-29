import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";

import { InputField } from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";

const CreatePost: React.FC = () => {
  const router = useRouter();
  useIsAuthenticated();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });

          if (!error) {
            router.push("/", { pathname: "/" });
          }
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

            <Button mt={4} color="teal" type="submit" isLoading={isSubmitting}>
              Publish
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
