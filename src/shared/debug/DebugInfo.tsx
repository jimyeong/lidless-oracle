
import auth from '@react-native-firebase/auth';
import { useAuth } from '../../app/providers/AuthProvider';
import { View, Text } from 'react-native';

export default function DebugInfo() {
  const { user, firebaseUser } = useAuth();
  console.log('@@@DebugInfo', firebaseUser, user);

  return (
    <View>
      <Text>Firebase: {firebaseUser?.email}</Text>
      <Text>Domain: {user?.email} (id: {user?.id})</Text>
      <Text>currentUser: {auth().currentUser?.email}</Text>
    </View>
  );
}