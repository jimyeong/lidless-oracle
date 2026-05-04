import { useState , useEffect , createContext, useContext} from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ME } from '../../features/auth-by-google/api/syncUser';
import { useApolloClient } from '@apollo/client/react';
import auth from '@react-native-firebase/auth';
import { apolloClient } from '../../shared/api/apollo';

export type DomainUser = {
    id: string;
    email: string;
    displayName?: string | null;
    photoUrl?: string | null;
    role: string;
}

type AuthContextValue = {
    firebaseUser: FirebaseAuthTypes.User | null;
    user: DomainUser | null;
    initialising: boolean;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
    firebaseUser: null,
    user: null,
    initialising: true,
    refreshUser: async () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}){
    const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [user, setUser] = useState<DomainUser | null>(null);
    const [initialising, setInitialising] = useState(true);
    const client = useApolloClient();


    async function fetchDomainUser(): Promise<DomainUser | null>{
        try {
            const { data } = await client.query({
              query: ME,
              fetchPolicy: 'network-only',  
            });
            const {me} = data as {me: DomainUser};
            return me ?? null;
          } catch (e) {
            console.warn('[auth] Failed to fetch domain user:', e);
            return null;
          }
    }

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged( async (fbUser) => {
            setInitialising(true);
            setFirebaseUser(fbUser);
            if(!fbUser){
                setUser(null);
            }else{
                const domainUser = await fetchDomainUser();
                setUser(domainUser);
            }

            setInitialising(false);
        });
        return unsubscribe;
    }, []);

    async function refreshUser(){
        const domainUser = await fetchDomainUser();
        setUser(domainUser);
    }
    return (
        <AuthContext.Provider value={{firebaseUser, user, initialising, refreshUser}}>
            {children}
        </AuthContext.Provider> 
    )

}
export const useAuth = () => useContext(AuthContext);
export const logout = async () => {
    await auth().signOut();
    await apolloClient.resetStore();
}