// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/subgraphs/name/v2Adaptor-subgraph', // Replace with your actual local URL
  cache: new InMemoryCache(),
});

export default client;
