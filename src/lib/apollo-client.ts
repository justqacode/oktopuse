import { config } from '@/config/app.config';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: config.BASE_URL }),
  cache: new InMemoryCache(),
});

export default client;
