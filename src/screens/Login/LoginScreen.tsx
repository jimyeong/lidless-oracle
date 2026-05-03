import {
    View,
    Text,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../../shared/buttons/IconButton';
import { colors } from '../../shared/theme/tokens';
import { signInAndSync } from '../../features/auth-by-google/lib/signInFlow';
import {useAuth} from '../../app/providers/AuthProvider';
import { signInWithGoogle } from '../../shared/lib/auth/googleSignIn';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
    const {refreshUser} = useAuth();
    const handleGoogleLogin = async () => {
        try{
            // const {user} = await signInWithGoogle();
            // console.log("Current user: ", auth().currentUser?.getIdToken());
            // console.log("Signed in: ", user.email);
            await signInAndSync();
            await refreshUser();
        }catch(error){
            console.error(error);
            // add event bus
            Alert.alert('Error', 'Failed to login with Google');
        }
        
        console.log('Google login');
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.logoWrapper}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoPlaceholderText}>LOGO</Text>
                    </View>
                    <Text style={styles.appName}>Lidless Oracle</Text>
                    <Text style={styles.tagline}>See clearly. Act wisely.</Text>
                </View>

                <View style={styles.authWrapper}>
                    <IconButton
                        onPress={handleGoogleLogin}
                        label="Continue with Google"
                        icon={<Text style={styles.googleIconText}>G</Text>}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.base,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'space-between',
        paddingBottom: 48,
    },
    logoWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    logoPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 24,
        backgroundColor: colors.bg.surface,
        borderWidth: 1,
        borderColor: colors.bg.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    logoPlaceholderText: {
        color: colors.text.muted,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: colors.text.secondary,
        letterSpacing: 0.5,
    },
    authWrapper: {
        gap: 12,
    },
    googleIconText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '700',
    },
});

export default LoginScreen;
