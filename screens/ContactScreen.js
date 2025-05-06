import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Text as SvgText} from 'react-native-svg';
import {API_URL} from '../apiconfig';

import SearchScreen from './SearchScreen';
import PreviewScreen from './PreviewScreen';
import ViewScreen from './ViewScreen';
import AuthorScreen from './AuthorScreen';
import TagScreen from './TagScreen';

import HeaderComponent from '../components/HeaderComponent';

const Stack = createNativeStackNavigator();

function generateRandomAlphanumeric(length) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

function distortText(text) {
  return (
    <Svg>
      {text.split('').map((char, index) => {
        const angle = Math.random() * 10 - 5; // Random angle between -5 and 5 degrees
        return (
          <SvgText
            key={index}
            transform={`rotate(${angle})`}
            fontSize="24"
            fill="black"
            x={index * 20}
            y="25">
            {char}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function ContactScreen({navigation}) {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState(
    generateRandomAlphanumeric(6),
  );

  const handleSubmit = () => {
    if (!email || !subject || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (captchaValue !== generatedCaptcha.toString()) {
      Alert.alert('Error', 'Incorrect captcha. Please try again.');
      return;
    }

    axios
      .post(`${API_URL}/public/contact-us`, {
        email: email,
        subject: subject,
        message: message,
      })
      .then(response => {
        console.log('Response:', response.data);
        Alert.alert('Success', 'Form submitted successfully.');
        setEmail('');
        setSubject('');
        setMessage('');
        handleRefreshCaptcha();
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to submit form. Please try again later.');
      });
  };

  const handleRefreshCaptcha = () => {
    setGeneratedCaptcha(generateRandomAlphanumeric(6));
    setCaptchaValue('');
  };

  const navigateSearchScreen = () => {
    navigation.navigate('Search', {search});
  };

  useEffect(() => {
    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
  }, [isConnected, isFocused]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -90}>
        <ScrollView>
          <HeaderComponent
            navigateSearch={true}
            onPress={navigateSearchScreen}
            handleSearch={navigateSearchScreen}
            search={search}
            setSearch={setSearch}
          />
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
              {isConnected ? (
                <View>
                  <Text style={styles.label}>Email Addess:</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Text style={styles.label}>Subject:</Text>
                  <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                  />
                  <Text style={styles.label}>Message:</Text>
                  <TextInput
                    style={[styles.input, {height: 100}]}
                    value={message}
                    onChangeText={setMessage}
                    multiline={true}
                  />
                  <Text style={[styles.label, {textAlign: 'center'}]}>
                    Captcha
                  </Text>
                  <View style={styles.captchaContainer}>
                    <View style={styles.captchaContent}>
                      <View style={styles.svgContainer}>
                        <Svg height="40" width="115">
                          <SvgText>{distortText(generatedCaptcha)}</SvgText>
                        </Svg>
                      </View>
                      <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRefreshCaptcha}>
                        <Text>
                          <Icon name="refresh" size={30} color="white" />{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.captchaInput}
                      value={captchaValue}
                      onChangeText={setCaptchaValue}
                      placeholder="Enter the captcha"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <View style={styles.socialMediaContainer}>
                    <TouchableOpacity
                      onPress={() => Linking.openURL('tel:+63354229167')}>
                      <Text style={styles.contact}>
                        Contact no.: +6335-422-9167
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://www.facebook.com/foundationu.edu',
                          )
                        }>
                        <Text style={styles.icon}>
                          <Icon name="facebook" size={30} color="#9a1b2f" />
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://twitter.com/foundationudgte?t=C03uuz0MrKpjH7APq7cy4Q&s=07',
                          )
                        }>
                        <Text style={styles.icon}>
                          <Icon name="twitter" size={30} color="#9a1b2f" />
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://www.instagram.com/foundationudgte/',
                          )
                        }>
                        <Text style={styles.icon}>
                          <Icon name="instagram" size={30} color="#9a1b2f" />
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://www.youtube.com/user/FoundationUdgte',
                          )
                        }>
                        <Text style={styles.icon}>
                          <Icon name="youtube" size={30} color="#9a1b2f" />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.noInternetContainer}>
                  <Text style={styles.noInternetText}>
                    No Internet Connection
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ContactTab() {
  return (
    <Stack.Navigator initialRouteName="Contact">
      <Stack.Screen
        name="Contact Us"
        component={ContactScreen}
        options={{
          title: 'CONTACT',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'SEARCH',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={({route}) => ({
          title: route.params?.preview.name || 'Preview',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="View"
        component={ViewScreen}
        options={({route}) => ({
          title: route.params?.view.name || 'View',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="Author"
        component={AuthorScreen}
        options={({route}) => ({
          title: route.params?.author.name || 'View',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="Tag"
        component={TagScreen}
        options={({route}) => ({
          title: route.params?.tag.name || 'View',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9a1b2f',
  },
  captchaContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  captchaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
    flexGrow: 1,
  },
  svgContainer: {
    padding: 10,
    backgroundColor: '#CCC',
    borderRadius: 5,
  },
  refreshButton: {
    backgroundColor: '#9a1b2f',
    padding: 15,
    borderRadius: 3,
    marginLeft: 10,
  },
  captchaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: 210,
    color: '#000',
  },

  button: {
    backgroundColor: '#9a1b2f',
    padding: 15,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    width: 210,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialMediaContainer: {
    marginVertical: 10,
  },
  contact: {
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  icon: {
    paddingHorizontal: 10,
  },
});

export default ContactTab;
