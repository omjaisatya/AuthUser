import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {saveUserData, getUserData} from '../services/storageService';

const {width, height} = Dimensions.get('window');

const scaleFont = (size: number) => {
  const scaleFactor = width / 375;
  return Math.round(size * Math.min(scaleFactor, 1.8));
};

const verticalScale = (size: number) => (size / 812) * height;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scaleFont(size) - size) * factor;

const CONTAINER_PADDING = width * 0.05;
const OPTION_WIDTH = width * 0.8;
const BUTTON_PADDING = verticalScale(15);

type GenderScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gender'
>;

interface Props {
  navigation: GenderScreenNavigationProp;
}

const GenderScreen: React.FC<Props> = ({navigation}) => {
  const [gender, setGender] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setExistingData(data);
          if (data.gender) setGender(data.gender);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExistingData();
  }, []);

  const handleContinue = async () => {
    if (!gender) return;

    try {
      setIsLoading(true);
      await saveUserData({...existingData, gender});
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving gender:', error);
      Alert.alert('Error', 'Failed to save gender selection');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Gender</Text>

      <TouchableOpacity
        style={[styles.option, gender === 'Male' && styles.selectedOption]}
        onPress={() => setGender('Male')}>
        <Text
          style={[styles.optionText, gender === 'Male' && styles.selectedText]}>
          Male
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, gender === 'Female' && styles.selectedOption]}
        onPress={() => setGender('Female')}>
        <Text
          style={[
            styles.optionText,
            gender === 'Female' && styles.selectedText,
          ]}>
          Female
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, gender === 'Other' && styles.selectedOption]}
        onPress={() => setGender('Other')}>
        <Text
          style={[
            styles.optionText,
            gender === 'Other' && styles.selectedText,
          ]}>
          Other
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !gender && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!gender}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: CONTAINER_PADDING,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    color: '#333',
    textAlign: 'center',
  },
  option: {
    width: OPTION_WIDTH,
    padding: verticalScale(15),
    marginVertical: verticalScale(10),
    backgroundColor: '#e0e0e0',
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: scaleFont(18),
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    marginTop: verticalScale(20),
    padding: BUTTON_PADDING,
    backgroundColor: '#007BFF',
    width: OPTION_WIDTH,
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: scaleFont(18),
    color: '#fff',
    fontWeight: 'bold',
  },
});
