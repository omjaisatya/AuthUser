import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
const BUTTON_WIDTH = width * 0.9;
const PROGRESS_HEIGHT = verticalScale(6);

type AgeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Age'>;

interface Props {
  navigation: AgeScreenNavigationProp;
}

const AgeScreen: React.FC<Props> = ({navigation}) => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState<Record<string, any>>({});

  const ageGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setExistingData(data);
          if (data.age) setSelectedAge(data.age);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleContinue = async () => {
    if (!selectedAge) return;
    try {
      setIsLoading(true);
      await saveUserData({...existingData, age: selectedAge});
      navigation.navigate('Gender');
    } catch (error) {
      console.error('Failed to save age:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={['#FFA07A', '#FF69B4']}
          style={styles.progressFill}
        />
      </View>

      {/* Title */}
      <Text style={styles.subtitle}>Great, Let's make Mynd all about you!</Text>
      <Text style={styles.title}>
        How long have you been rocking this{' '}
        <Text style={styles.highlight}>World?</Text>
      </Text>

      <View style={styles.ageContainer}>
        {ageGroups.map(age => (
          <TouchableOpacity
            key={age}
            style={[
              styles.ageButton,
              selectedAge === age && styles.selectedAgeButton,
            ]}
            onPress={() => setSelectedAge(age)}>
            <Text
              style={[
                styles.ageText,
                selectedAge === age && styles.selectedAgeText,
              ]}>
              {age}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedAge && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!selectedAge}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: verticalScale(40),
  },
  progressBar: {
    width: '100%',
    height: PROGRESS_HEIGHT,
    backgroundColor: '#E0E0E0',
    borderRadius: PROGRESS_HEIGHT / 2,
    marginTop: verticalScale(40),
  },
  progressFill: {
    width: '20%',
    height: '100%',
    borderRadius: PROGRESS_HEIGHT / 2,
  },
  subtitle: {
    fontSize: scaleFont(14),
    color: '#777',
    marginTop: verticalScale(30),
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: verticalScale(10),
    lineHeight: moderateScale(32),
  },
  highlight: {
    color: '#FFA07A',
    fontWeight: 'bold',
  },
  ageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    gap: verticalScale(8),
  },
  ageButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: verticalScale(12),
    paddingHorizontal: width * 0.06,
    borderRadius: moderateScale(30),
    minWidth: width * 0.35,
  },
  selectedAgeButton: {
    backgroundColor: '#FFA07A',
  },
  ageText: {
    fontSize: scaleFont(16),
    color: '#333',
    textAlign: 'center',
  },
  selectedAgeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  continueButton: {
    width: BUTTON_WIDTH,
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(30),
    marginTop: verticalScale(30),
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    position: 'absolute',
    bottom: verticalScale(40),
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: scaleFont(18),
    color: '#FFF',
    fontWeight: 'bold',
  },
});
