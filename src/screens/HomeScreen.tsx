import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {getUserData, clearUserData, UserData} from '../services/storageService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';

const {width, height} = Dimensions.get('window');

const scaleFont = (size: number) => {
  const scaleFactor = width / 375;
  return Math.round(size * Math.min(scaleFactor, 1.8));
};

const verticalScale = (size: number) => {
  return (size / 812) * height;
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scaleFont(size) - size) * factor;
};

const PROFILE_IMAGE_SIZE = verticalScale(100);
const BUTTON_PADDING = verticalScale(15);
const CONTAINER_PADDING = width * 0.05;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await clearUserData();
      await GoogleSignin.signOut();
      navigation.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: handleLogout},
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: userData?.photo}} style={styles.profileImage} />
      <Text style={styles.title}>{userData?.name || 'Undefine User'}</Text>
      <Text style={styles.email}>{userData?.email || ''}</Text>

      <Text style={styles.text}>Age: {userData?.age || 'N/A'}</Text>
      <Text style={styles.text}>Gender: {userData?.gender || 'N/A'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: verticalScale(40),
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    marginBottom: verticalScale(15),
    alignSelf: 'center',
  },
  placeholderImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    alignSelf: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: scaleFont(14),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
    color: '#2D3436',
  },
  text: {
    fontSize: scaleFont(18),
    marginBottom: verticalScale(5),
    color: '#636E72',
    textAlign: 'center',
  },
  email: {
    fontSize: scaleFont(16),
    color: '#636E72',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: verticalScale(20),
    backgroundColor: '#d9534f',
    padding: BUTTON_PADDING,
    borderRadius: moderateScale(8),
    alignSelf: 'center',
    width: '80%',
  },
  logoutText: {
    color: 'white',
    fontSize: scaleFont(16),
    textAlign: 'center',
    fontWeight: '600',
  },
});
