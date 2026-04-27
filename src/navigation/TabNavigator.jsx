import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ContactsScreen from '../screens/ContactsScreen';
import DialerScreen from '../screens/DialerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Dialer') {
            iconName = focused ? 'keypad' : 'keypad-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // Added a small glow effect behind the active icon
          return (
            <View style={focused ? styles.iconActiveBg : null}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        // --- COLORS & THEME ---
        tabBarActiveTintColor: '#5EE7DF', // Your signature cyan
        tabBarInactiveTintColor: 'rgba(138, 149, 168, 0.5)', // Muted gray-blue
        headerStyle: {
          backgroundColor: '#0F1724', // Match screen background
          elevation: 0, // Remove Android shadow
          shadowOpacity: 0, // Remove iOS shadow
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.05)',
        },
        headerTitleStyle: {
          color: '#F4F7FB',
          fontSize: 20,
          fontWeight: '800',
        },
        headerShown: true,
        
        // --- TAB BAR STYLE ---
        tabBarStyle: {
          backgroundColor: '#0F1724', // Match overall background
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: Platform.OS === 'ios' ? 88 : 70, // Extra height for modern feel
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="Dialer" 
        component={DialerScreen} 
        options={{ title: 'Dialer', headerShown: false }} 
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ title: 'Contacts' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconActiveBg: {
    // Optional: add a very subtle glow behind the active icon
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(94, 231, 223, 0.05)',
  }
});

export default TabNavigator;