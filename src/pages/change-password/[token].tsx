import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState<string>("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            token:
              typeof router.query.token === "string" ? router.query.token : "",
            newPassword: values.newPassword,
          });

          if (response.data?.changePassword.errors?.length) {
            const errorMap = toErrorMap(response.data?.changePassword.errors);

            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/", {});
          }

          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="A new and strong password"
              label="New password"
              type="password"
            />

            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">
                  {tokenError}
                </Box>

                <NextLink href="/forgot-password">
                  <Link>Want to recover it again?</Link>
                </NextLink>
              </Flex>
            ) : null}

            <Button mt={4} color="teal" type="submit" isLoading={isSubmitting}>
              Change password!
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
