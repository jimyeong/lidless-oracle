import {apolloClient} from '../../../shared/api/apollo';
import { SYNC_USER, ME } from '../api/syncUser';
import {signInWithGoogle} from '../../../shared/lib/auth/googleSignIn';
import { GraphQLError } from 'graphql';
import auth from '@react-native-firebase/auth';

export async function signInAndSync() {
    await signInWithGoogle();
    const fbUser = auth().currentUser;
    if(!fbUser) throw new Error('Sign-in completed but current User is null');
    const result = await apolloClient.mutate({
        mutation: SYNC_USER,
    })
    console.log("[SIGN_IN_AND_SYNC] result", result);
    
    const {data, error} = result as {data: {syncUser: {id: string, email: string, displayName: string, photoURL: string, createdAt: string, updatedAt: string}}, error: GraphQLError};   
    
    if(!data?.syncUser) throw new Error('Failed to sync user');
    return data.syncUser;
    
}