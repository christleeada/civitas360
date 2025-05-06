import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const ViewScreen = () => {
  const route = useRoute();
  const [view, setView] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.statusCode === 403) {
      setHttpError('403 Forbidden: You do not have permission to access this page.');
    }
  };

  useEffect(() => {
    setView(route.params ? route.params.view : '');
    console.log(route.params.view.url);

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.wrapper}>
      {isConnected ? (
        httpError ? (
          <WebView
            source={{ uri: view.url + '/mobile' }}
            onLoad={handleWebViewLoad}
            onHttpError={handleHttpError}
            style={styles.viewMobile}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        ) : (
          <WebView
            source={{ uri: view.url }}
            onLoad={handleWebViewLoad}
            onHttpError={handleHttpError}
            style={styles.view}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        )
      ) : (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view: {
    marginTop: 10,
    flex: 1,
  },
  viewMobile: {
    padding: 100,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  noInternetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9a1b2f',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ViewScreen;
