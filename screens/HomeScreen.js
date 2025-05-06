import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../apiconfig';

import HeaderComponent from '../components/HeaderComponent';
import CategoryScreen from './CategoryScreen';
import SearchScreen from './SearchScreen';
import PreviewScreen from './PreviewScreen';
import ViewScreen from './ViewScreen';
import AuthorScreen from './AuthorScreen';
import TagScreen from './TagScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [highlight, setHighlight] = useState('');
  const [featured, setFeatured] = useState('');
  const [latest, setLatest] = useState('');
  const [categories, setCategories] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const navigateSearchScreen = () => {
    navigation.navigate('Search', { search });
  };

  const navigatePreview = item => {
    navigation.navigate('Preview', { preview: item });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  const itemListCategory = category => {
    navigation.navigate('CategoryScreen', { category });
  };

  const fetchData = async () => {
    try {
      const responseHighlight = await axios.get(`${API_URL}/item-highlight/0`);
      setHighlight(responseHighlight.data.item);

      const responseFeatured = await axios.get(`${API_URL}/items-featured/0`);
      setFeatured(responseFeatured.data.items);

      const responseLatest = await axios.get(`${API_URL}/items-latest/0`);
      setLatest(responseLatest.data.items);

      const responseCategories = await axios.get(`${API_URL}/item-categories`);
      const categoriesData = responseCategories.data.categories;

      const categoryItemsPromises = categoriesData.map(async category => {
        const responseCategoryItems = await axios.get(
          `${API_URL}/items/0?category=${category.id}&sort=2`,
        );
        const uniqueItems = new Set();
        const uniqueCategoryItems = responseCategoryItems.data.items
          .filter(item => {
            if (!uniqueItems.has(item.id)) {
              uniqueItems.add(item.id);
              return true;
            }
            return false;
          })
          .slice(0, 5);

        return {
          category: category,
          items: uniqueCategoryItems,
        };
      });

      const categoryItems = await Promise.all(categoryItemsPromises);
      setCategories(categoryItems);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
    fetchData();
  }, [isConnected, isFocused]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigatePreview(item)}>
        <View style={styles.itemListContainer}>
          <View style={styles.shadowContainer}>
            <ImageBackground
              source={{ uri: item.cover }}
              style={
                screenWidth < 500
                  ? styles.itemImage1
                  : screenWidth < 750
                    ? styles.itemImage2
                    : styles.itemImage3
              }
              resizeMode="cover">
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.name}</Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#9a1b2f']}
              tintColor={'#9a1b2f'}
            />
          }>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#9a1b2f"
              style={styles.loading}
            />
          ) : (
            <View style={styles.mainContainer}>
              <View style={styles.highlightContainer}>
                {!highlight || highlight.length === 0 ? (
                  <Text style={styles.noItemsFoundText}>
                    No civitas highlight found.
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => navigatePreview(highlight)}>
                    <View style={styles.highlightContentContainter}>
                      <View style={styles.shadowContainer}>
                        <ImageBackground
                          source={{ uri: highlight.cover }}
                          style={
                            screenWidth < 500
                              ? styles.highlightImage1
                              : screenWidth < 750
                                ? styles.highlightImage2
                                : styles.highlightImage3
                          }
                          resizeMode="cover">
                          <View style={styles.overlay}>
                            <Text style={styles.highlightName}>
                              {highlight.name}
                            </Text>
                          </View>
                        </ImageBackground>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Featured Releases</Text>
                {!featured || featured.length === 0 ? (
                  <Text style={styles.noItemsFoundText}>
                    No featured releases found.
                  </Text>
                ) : (
                  <FlatList
                    data={featured}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Latest Releases</Text>
                {!latest || latest.length === 0 ? (
                  <Text style={styles.noItemsFoundText}>
                    No latest releases found.
                  </Text>
                ) : (
                  <FlatList
                    data={latest}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>

              {categories.map(category => (
                <View key={category.category.id} style={styles.itemContainer}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>
                      {category.category.label}
                    </Text>
                    <TouchableOpacity
                      onPress={() => itemListCategory(category.category)}
                      style={styles.arrowButton}>
                      <Text style={styles.linkText}>View More</Text>
                      <Icon name="arrow-top-right" size={17} color="grey" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={category.items.slice(0, 5)}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const HomeTab = ({ route }) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'HOME',
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
        options={({ route }) => ({
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTitle: () => (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 17,
                color: '#fff',
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {route.params?.preview.name || 'Preview'}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params?.category.label || 'CategoryScreen',
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
        options={({ route }) => ({
          title: route.params?.view.name || 'View',
          headerStyle: {
            backgroundColor: '#9a1b2f',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTitle: () => (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 17,
                color: '#fff',
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {route.params?.view.name || 'View'}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="Author"
        component={AuthorScreen}
        options={({ route }) => ({
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
        options={({ route }) => ({
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
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    padding: 5,
  },
  highlightContainer: {
    marginBottom: 20,
  },
  highlightContentContainter: {
    alignItems: 'center',
  },
  highlightImage1: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 10,
    height: 300,
  },
  highlightImage2: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 10,
    height: 350,
  },
  highlightImage3: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 10,
    height: 400,
  },
  highlightName: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  itemListContainer: {
    margin: 8
  },
  itemImage1: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2 - 20,
    height: (4 / 3) * (Dimensions.get('window').width / 2 - 20),
  },
  itemImage2: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3 - 20,
    height: (4 / 3) * (Dimensions.get('window').width / 3 - 20),
  },
  itemImage3: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 4 - 20,
    height: (4 / 3) * (Dimensions.get('window').width / 4 - 20),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    justifyContent: 'flex-start',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shadowContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  noItemsFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  arrowButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  linkText: {
    fontSize: 12,
    color: '#555',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },

  imageBackground: {
    width: 150,
    height: 200,
  },
});

export default HomeTab;
