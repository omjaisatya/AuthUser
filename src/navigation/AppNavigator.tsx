import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import NameScreen from '../screens/NameScreen';
import AgeScreen from '../screens/AgeScreen';
import GenderScreen from '../screens/GenderScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Name: undefined;
  Age: undefined;
  Gender: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
