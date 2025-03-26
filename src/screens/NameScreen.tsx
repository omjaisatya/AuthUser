import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {getUserData, UserData} from '../services/storageService';

const {width, height} = Dimensions.get('window');

const scaleFont = (size: number) => {
  const scaleFactor = width / 375;
  return Math.round(size * Math.min(scaleFactor, 1.5));
};

const verticalScale = (size: number) => {
  const scaleFactor = height / 812;
  return Math.round(size * scaleFactor);
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scaleFont(size) - size) * factor;
};

const INPUT_HEIGHT = verticalScale(50);
const BUTTON_PADDING = verticalScale(15);
const PROGRESS_HEIGHT = verticalScale(4);

type NameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Name'>;
type NameScreenRouteProp = RouteProp<RootStackParamList, 'Name'>;

interface Props {
  navigation: NameScreenNavigationProp;
  route: NameScreenRouteProp;
}

const NameScreen: React.FC<Props> = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [storedUser, setStoredUser] = useState<UserData | null>(null);

  const routeUser = route.params?.user;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setStoredUser(userData);
        const initialName = routeUser?.name || userData?.name || '';
        setName(initialName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [routeUser]);

  const handleContinue = () => {
    if (name.trim().length > 0) {
      navigation.navigate('Age', {user: {...storedUser, name}});
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#FFFFFF', '#FDF2EB']} style={styles.container}>
        <ActivityIndicator size="large" color="#FF9A5A" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFFFFF', '#FDF2EB']} style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} />
      </View>

      <Text style={styles.subHeading}>Let’s get to know each other</Text>
      <Text style={styles.heading}>
        <Text style={styles.highlight}>What</Text> Should We Call{' '}
        <Text style={styles.bold}>You?</Text>
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Edit your name"
        editable={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={name.trim() === ''}>
        <LinearGradient
          colors={['#FF9A5A', '#FF78C4']}
          style={styles.gradientButton}>
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: verticalScale(60),
  },
  progressContainer: {
    width: '100%',
    height: PROGRESS_HEIGHT,
    backgroundColor: '#EAEAEA',
    borderRadius: PROGRESS_HEIGHT / 2,
    marginBottom: verticalScale(40),
  },
  progressBar: {
    width: '40%',
    height: '100%',
    backgroundColor: '#FF9A5A',
    borderRadius: PROGRESS_HEIGHT / 2,
  },
  subHeading: {
    fontSize: scaleFont(14),
    color: '#777',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  heading: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: verticalScale(30),
  },
  highlight: {
    color: '#FF9A5A',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  input: {
    width: '90%',
    height: INPUT_HEIGHT,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: INPUT_HEIGHT / 2,
    paddingHorizontal: width * 0.05,
    fontSize: scaleFont(16),
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginBottom: verticalScale(40),
  },
  button: {
    width: '90%',
    borderRadius: INPUT_HEIGHT / 2,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: BUTTON_PADDING,
    alignItems: 'center',
    borderRadius: INPUT_HEIGHT / 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
  },
});

export default NameScreen;
