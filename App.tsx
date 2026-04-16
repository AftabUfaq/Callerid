import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens (ensure the file paths are correct)
import SplashScreen from './src/screens/SplashScreen';
import PrimaryLanguageScreen from './src/screens/PrimaryLanguageScreen';
import SecondaryLanguageScreen from './src/screens/SecondaryLanguageScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import PermissionsScreen from './src/screens/PermissionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabNavigator from './src/navigation/TabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="PrimaryLanguage" component={PrimaryLanguageScreen} />
        <Stack.Screen name="SecondaryLanguage" component={SecondaryLanguageScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        
        {/* Main App Screens */}
        <Stack.Screen name="MainApp" component={ProfileScreen} /> 
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}