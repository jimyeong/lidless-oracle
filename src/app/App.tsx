/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import LoginScreen from '../screens/Login/LoginScreen';
import DebugInfo from '../shared/debug/DebugInfo';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '../shared/api/apollo';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import RootNavigator from './RootNavigator';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
