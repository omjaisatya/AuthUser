import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import {
  clearUserData,
  getUserData,
  saveUserData,
  UserData,
} from './storageService';

if (!Config.FIREBASE_WEB_CLIENT) {
  throw new Error('Missing GOOGLE_WEB_CLIENT_ID in environment configuration');
}

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const signInWithGoogle = async (): Promise<UserData | null> => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    console.log('Google SignIn Response:', JSON.stringify(userInfo, null, 2));

    if (!userInfo || !userInfo.data?.user) {
      console.warn('Google sign-in succeeded but user data is missing');
      return null;
    }

    const {user} = userInfo.data;
    const userData: UserData = {
      name: user.name || '',
      email: user.email || '',
      photo: user.photo || '',
    };

    await saveUserData(userData);
    return userData;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);

    if (error.code) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('User cancelled login');
          break;
        case statusCodes.IN_PROGRESS:
          console.log('Sign-in already in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play Services not available');
          break;
        default:
          console.log('Unknown error:', error);
      }
    }
    return null;
  }
};

export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
    await clearUserData();
    console.log('User signed out and data cleared');
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
};

export const isSignedIn = async (): Promise<boolean> => {
  try {
    const isSignedIns = await GoogleSignin.signIn();
    const userData = await getUserData();
    return isSignedIns && userData !== null;
  } catch (error) {
    console.error('Error checking sign-in status:', error);
    return false;
  }
};
