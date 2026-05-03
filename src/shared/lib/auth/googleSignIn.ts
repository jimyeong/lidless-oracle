import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth  from '@react-native-firebase/auth';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';

GoogleSignin.configure({
    webClientId: "531569239257-gdoe6mdvaotofn6alum65350ilm1mcca.apps.googleusercontent.com"
});


export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const result = await GoogleSignin.signIn();
    const idToken = (result as any).data?.idToken ?? (result as any).idToken;
    if(!idToken) throw new Error("No id token found");

    const credential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(credential)
}

export async function signOutFromGoogle(): Promise<void>{
    await GoogleSignin.signOut();
    await auth().signOut();
}
