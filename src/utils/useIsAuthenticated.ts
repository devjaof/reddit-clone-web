import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMeQuery } from "../generated/graphql";

export const useIsAuthenticated = () => {
  const router = useRouter();

  // const [{ fetching, data }] = useMeQuery();

  // useEffect(() => {
  //   if (!fetching && !data?.me) {
  //     router.replace(`/login?next=${router.pathname}`);
  //   }

  // }, [fetching, data, router]);
};
