import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {API_URL} from '../apiconfig';

import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';

const SearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [popular, setPopular] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const textInputRef = useRef(null);

  const navigatePreview = item => {
    navigation.navigate('Preview', {preview: item});
  };

  const onRefresh = () => {
    setRefreshing(true);

    if (search != '') {
      handleSearch();
    } else {
      fetchPopular();
    }
  };

  const onChangeSearch = async search => {
    setSearch(search);
    setLoading(true);

    if (search != '') {
      fetchSearch(search);
    } else {
      fetchPopular();
    }
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/items-search/0?search=${encodeURIComponent(search)}`,
      );
      setSearchResult(response.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPopular = async () => {
    try {
      const response = await axios.get(`${API_URL}/items-popular/0`);
      setPopular(response.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSearch = async search => {
    try {
      const response = await axios.get(
        `${API_URL}/items-search/0?search=${encodeURIComponent(search)}`,
      );
      setSearchResult(response.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setSearch(route.params ? route.params.search : '');

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (route.params.search != '') {
      fetchSearch(route.params.search);
    } else {
      fetchPopular();
    }

    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isConnected, route.params]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => navigatePreview(item)}>
        <View style={styles.itemListContainer}>
          <View style={styles.itemDetailsContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <View style={styles.shadowContainer}>
            <Image source={{uri: item.cover}} style={styles.itemImage} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : -80}>
        <HeaderComponent
          navigateSearch={false}
          handleSearch={handleSearch}
          onChange={onChangeSearch}
          search={search}
          setSearch={setSearch}
          textInputRef={textInputRef}
        />

        {isConnected ? (
          loading ? (
            <ActivityIndicator
              size="large"
              color="#9a1b2f"
              style={styles.loading}
            />
          ) : (
            <View style={{flex: 1}}>
              <Text style={styles.itemTitle}>
                {search === ''
                  ? 'Popular Releases'
                  : `${searchResult.length} Result(s) found.`}
              </Text>
              <FlatList
                data={search === '' ? popular : searchResult}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#9a1b2f']}
                    tintColor={'#9a1b2f'}
                  />
                }
                style={{borderTopWidth: 1, borderTopColor: '#dfe6e9'}}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )
        ) : (
          <View style={styles.noInternetContainer}>
            <Text style={styles.noInternetText}>No Internet Connection</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemTitle: {
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  itemListContainer: {
    flexDirection: 'row',
    height: 'auto',
    borderBottomWidth: 1,
    borderColor: '#dfe6e9',
    backgroundColor: '#fff',
    overflow: 'hidden',
    padding: 10,
  },
  itemImage: {
    width: 75,
    height: 100,
  },
  itemDetailsContainer: {
    flex: 1,
    paddingRight: 20,
  },
  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  itemDescription: {
    fontSize: 14,
    color: '#000',
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
  loading: {
    margin: 25,
  },
});

export default SearchScreen;
