import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '../apiconfig';

import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const navigateSearchScreen = () => {
    navigation.navigate('Search', {search});
  };

  const navigatePreview = item => {
    navigation.push('Preview', {preview: item});
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(category);
  };

  const fetchData = async category => {
    try {
      const response = await axios.get(
        `${API_URL}/items/0?category=${category}&sort=2`,
      );
      setItems(response.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    setCategory(route.params ? route.params.category.id : '');

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    fetchData(route.params ? route.params.category.id : '');
  }, [isConnected, route.params, category]);

  const renderItem = ({item, index}) => {
    if (index >= item.length) {
      return (
        <View
          style={
            screenWidth < 500
              ? styles.invisibleItem2
              : screenWidth < 750
              ? styles.invisibleItem3
              : styles.invisibleItem4
          }
        />
      );
    }

    return (
      <TouchableOpacity onPress={() => navigatePreview(item)}>
        <View style={styles.itemGridContainer}>
          <View style={styles.shadowContainer}>
            <ImageBackground
              source={{uri: item.cover}}
              style={
                screenWidth < 500
                  ? styles.itemImageGrid2
                  : screenWidth < 750
                  ? styles.itemImageGrid3
                  : styles.itemImageGrid4
              }>
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.name}</Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const numColumns = screenWidth < 500 ? 2 : screenWidth < 750 ? 3 : 4;

  const invisibleItemCount =
    (numColumns - (items.length % numColumns)) % numColumns;

  const invisibleItems = Array(invisibleItemCount).fill('');

  return (
    <SafeAreaView style={styles.wrapper}>
      <HeaderComponent
        navigateSearch={true}
        onPress={navigateSearchScreen}
        handleSearch={navigateSearchScreen}
        search={search}
        setSearch={setSearch}
      />

      {isConnected ? (
        loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#9a1b2f"
          />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={[...items, ...invisibleItems]}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              key={'grid'}
              numColumns={screenWidth < 500 ? 2 : screenWidth < 750 ? 3 : 4}
              columnWrapperStyle={{
                justifyContent: 'space-evenly',
                alignItems: 'flex-end',
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContentContainer}
              ListEmptyComponent={
                <Text style={styles.noItemText}>No items found.</Text>
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#9a1b2f']}
                  tintColor={'#9a1b2f'}
                />
              }
            />
          </View>
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
  itemGridContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  itemImageGrid2: {
    width: Dimensions.get('window').width / 2 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 2 - 10),
  },
  itemImageGrid3: {
    width: Dimensions.get('window').width / 3 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 3 - 10),
  },
  itemImageGrid4: {
    width: Dimensions.get('window').width / 4 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 4 - 10),
  },
  invisibleItem2: {
    width: Dimensions.get('window').width / 2 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 2 - 10),
  },
  invisibleItem3: {
    width: Dimensions.get('window').width / 3 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 3 - 10),
  },
  invisibleItem4: {
    width: Dimensions.get('window').width / 4 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 4 - 10),
  },
  gridContentContainer: {
    paddingTop: 5,
  },
  loading: {
    margin: 25,
  },
  shadowContainer: {
    borderRadius: 5,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    justifyContent: 'flex-start',
  },
  overlayText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  noItemText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    padding: 10,
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  noInternetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9a1b2f',
  },
});

export default CategoryScreen;
