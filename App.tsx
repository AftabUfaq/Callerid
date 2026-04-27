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
import SettingsScreen from './src/screens/SettingsScreen'
import ContactDetailScreen from './src/screens/ContactDetailScreen'
import IncomingCallScreen from './src/screens/IncomingCallScreen';
import ActiveCallScreen from './src/screens/ActiveCallScreen';
import SpamAlertScreen from './src/screens/SpamAlertScreen';
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
          {/* 1. Startup & Setup Group */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="PrimaryLanguage" component={PrimaryLanguageScreen} />
          <Stack.Screen name="SecondaryLanguage" component={SecondaryLanguageScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />

          {/* 2. Authentication & Permissions */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="ContactDetails" component={ContactDetailScreen} />
          <Stack.Screen name="incomingcall" component={IncomingCallScreen} />
          <Stack.Screen name="activecall" component={ActiveCallScreen} />
          <Stack.Screen name="spamalert" component={SpamAlertScreen} />

          {/* 3. Main Application Entry */}
          <Stack.Screen name="MainTabs" component={TabNavigator} />

          {/* 4. Secondary Feature Screens (Pushed over Tabs) */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name='Settings' component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}