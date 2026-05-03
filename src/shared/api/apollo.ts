// src/shared/api/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://192.168.0.18:4000/graphql'
    : 'http://localhost:4000/graphql'
  : 'https://your-prod-api.com/graphql';

  console.log("[APOLLO] API_URL", API_URL);
const httpLink = new HttpLink({
    uri: API_URL,
});

const authLink = new SetContextLink(async (prevContext: any) => {
  const fbUser = auth().currentUser;
  console.log('[authLink] currentUser:', fbUser?.email ?? 'NULL');
  
  if (!fbUser) return prevContext;

  const idToken = await fbUser.getIdToken();
  console.log('[authLink] attaching token:', idToken.substring(0, 30));
  
  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: `Bearer ${idToken}`,
    },
  };
});
const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message, path }) => {
        console.warn(`[GraphQL error] ${message}`, path);
      });
    } else {
      console.warn('[Network or other error]', error);
    }
  });

  export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
  