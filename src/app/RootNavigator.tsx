import { useEffect, useState } from 'react';
import { useAuth } from './providers/AuthProvider';
import LoginScreen from '../screens/Login/LoginScreen';
import SplashScreen, {
  SPLASH_MIN_VISIBLE_MS,
} from '../screens/Splash/SplashScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LoadingIndicator from '../shared/indicators/LoadingIndicator';

export default function RootNavigator() {
  const { user, initialising } = useAuth();
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinSplashElapsed(true), SPLASH_MIN_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  const showSplash = initialising || !minSplashElapsed;
  // console.log("initialising", initialising);
  
  if (showSplash) return <SplashScreen />;
  if (!user) return <LoginScreen />;
  
  return <HomeScreen />;
}
