import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import { createClient, Provider,dedupExchange, fetchExchange } from 'urql'

import { cacheExchange } from '@urql/exchange-graphcache'

const client = createClient({ 
  url: 'http://localhost:4400/graphql', 
  fetchOptions: {
    credentials: "include"
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (result, args, cache, info) => {
          // cache.updateQuery({ query: MeDocument })
        },
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
