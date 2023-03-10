import theme from '../theme'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { createClient, Provider,dedupExchange, fetchExchange } from 'urql'
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

const client = createClient({ 
  url: 'http://localhost:4400/graphql', 
  fetchOptions: {
    credentials: "include"
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache, 
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query;
              } else {
                return {
                  me: result.login.user
                }
              }
            }
          )
        },

        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(cache, 
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query;
              } else {
                return {
                  me: result.register.user
                }
              }
            }
          )
        },

        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            () => ({ me: null })
          )
        }
      },
    },
  }), fetchExchange],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
