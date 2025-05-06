// App.js

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState, useEffect} from 'react';

import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import ContactScreen from './screens/ContactScreen';
import SplashScreenContent from './screens/SplashScreenContent';

const Tab = createBottomTabNavigator();

function App() {
  const [hideSplashScreen, setHideSplashScreen] = useState(false);

  useEffect(() => {
    const hideSplash = setTimeout(() => {
      setHideSplashScreen(true);
    }, 3000);

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <NavigationContainer>
      {hideSplashScreen ? (
        <Tab.Navigator
          initialRouteName="HomeTab"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {borderTopWidth: 1, borderColor: '#cbccd0'},
          }}>
          <Tab.Screen
            name="HomeTab"
            component={HomeScreen}
            options={{
              tabBarLabel: 'HOME',
              tabBarLabelStyle: {
                fontSize: 13,
                fontWeight: 'bold',
                marginBottom: 5,
              },
              tabBarIcon: () => <Icon name="home" size={25} color={'#000'} />,
              tabBarIconStyle: {
                marginTop: 3,
              },
              tabBarActiveTintColor: '#9a1b2f',
              tabBarInactiveTintColor: '#000',
              tabBarHideOnKeyboard: true,
            }}
          />
          <Tab.Screen
            name="LibraryTab"
            component={LibraryScreen}
            options={{
              tabBarLabel: 'LIBRARY',
              tabBarLabelStyle: {
                fontSize: 13,
                fontWeight: 'bold',
                marginBottom: 5,
              },
              tabBarIcon: () => (
                <Icon name="bookshelf" size={25} color={'#000'} />
              ),
              tabBarIconStyle: {
                marginTop: 3,
              },
              tabBarActiveTintColor: '#9a1b2f',
              tabBarInactiveTintColor: '#000',
              tabBarHideOnKeyboard: true,
            }}
          />
          <Tab.Screen
            name="ContactTab"
            component={ContactScreen}
            options={{
              tabBarLabel: 'CONTACT',
              tabBarLabelStyle: {
                fontSize: 13,
                fontWeight: 'bold',
                marginBottom: 5,
              },
              tabBarIcon: () => <Icon name="phone" size={25} color={'#000'} />,
              tabBarIconStyle: {
                marginTop: 3,
              },
              tabBarActiveTintColor: '#9a1b2f',
              tabBarInactiveTintColor: '#000',
              tabBarHideOnKeyboard: true,
            }}
          />
        </Tab.Navigator>
      ) : (
        <SplashScreenContent />
      )}
    </NavigationContainer>
  );
}

export default App;
