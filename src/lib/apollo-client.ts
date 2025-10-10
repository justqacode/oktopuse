import { useAuthStore } from '@/auth/authStore';
import { config } from '@/config/app.config';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: config.BASE_URL });

const authLink = new SetContextLink((prevContext) => {
  const { token } = useAuthStore.getState();
  if (!token) {
    prevContext.headers;
  }

  return {
    headers: {
      ...prevContext.headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

// OLD ONE FOR BASE URL ONLY
// const client = new ApolloClient({
//   link: new HttpLink({ uri: config.BASE_URL }),
//   cache: new InMemoryCache(),
// });

// export default client;
