import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Image, StyleSheet} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const Splash = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < 1) {
          return prevProgress + 0.2;
        }
        return prevProgress;
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Image
        source={require('../assets/img/app_logo.png')}
        style={styles.image}
      />
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} width={300} color="#9a1b2f" />
      </View>
      <Image
        source={require('../assets/img/fu_logo.png')}
        style={styles.logo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    height: 400,
    width: 300,
  },
  progressBarContainer: {
    marginTop: 150,
  },
  logo: {
    marginTop: 50,
    height: 75,
    width: 75,
  },
});

export default Splash;
