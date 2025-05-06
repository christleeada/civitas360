import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../apiconfig';

import SearchScreen from './SearchScreen';
import PreviewScreen from './PreviewScreen';
import ViewScreen from './ViewScreen';
import AuthorScreen from './AuthorScreen';
import TagScreen from './TagScreen';

import HeaderComponent from '../components/HeaderComponent';
import DropdownComponent from '../components/DropdownComponent';

const Stack = createNativeStackNavigator();

function LibraryScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [optionsCategory, setOptionsCategory] = useState([
    { id: 'all', label: 'All Categories' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [items, setItems] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const navigateSearchScreen = () => {
    navigation.navigate('Search', { search });
  };

  const navigatePreview = item => {
    navigation.navigate('Preview', { preview: item });
  };

  const onRefresh = () => {
    setRefreshing(true);

    refreshData();
  };

  const onSelectCategory = async value => {
    setLoading(true);

    try {
      const responseItems = await axios.get(
        `${API_URL}/items/0?category=${value.id}&sort=${selectedSort}`,
      );

      setItems(responseItems.data.items);
      setSelectedCategory(value.id);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectSort = async value => {
    setLoading(true);

    try {
      const responseItems = await axios.get(
        `${API_URL}/items/0?category=${selectedCategory}&sort=${value.id}`,
      );

      setItems(responseItems.data.items);
      setSelectedSort(value.id);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const responseItems = await axios.get(
        `${API_URL}/items/0?category=${selectedCategory}&sort=${selectedSort}`,
      );

      setItems(responseItems.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchData = async () => {
    try {
      const responseCategories = await axios.get(`${API_URL}/item-categories`);

      const selectCategories = [];

      selectCategories.push({
        id: 'all',
        label: 'All Categories',
      });

      responseCategories.data.categories.forEach(item => {
        selectCategories.push({
          id: item.id,
          label: item.label,
        });
      });

      setOptionsCategory(selectCategories);

      const responseItems = await axios.get(
        `${API_URL}/items/0?category=${selectedCategory}&sort=${selectedSort}`,
      );

      setItems(responseItems.data.items);
    } catch (error) {
      console.error('Error retrieving data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const optionsSort = [
    { id: '1', label: 'Sort by Title' },
    { id: '2', label: 'Sort by Release Date' },
    { id: '3', label: 'Sort by Popularity' },
  ];

  useEffect(() => {
    setSelectedCategory('all');
    setSelectedSort('1');

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    fetchData();
  }, [isConnected, isFocused]);

  const renderItem = ({ item, index }) => {
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
        <View
          style={
            isGridView ? styles.itemGridContainer : styles.itemListContainer
          }>
          <View style={styles.shadowContainer}>
            <ImageBackground
              source={{ uri: item.cover }}
              style={
                isGridView
                  ? screenWidth < 500
                    ? styles.itemImageGrid2
                    : screenWidth < 750
                      ? styles.itemImageGrid3
                      : styles.itemImageGrid4
                  : styles.itemImage
              }>
              {!isGridView ? null : (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>{item.name}</Text>
                </View>
              )}
            </ImageBackground>
          </View>
          <View style={isGridView ? null : styles.itemDetailsContainer}>
            {isGridView ? null : (
              <Text style={styles.itemName}>{item.name}</Text>
            )}
            {isGridView ? null : (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const numColumns = isGridView
    ? screenWidth < 500
      ? 2
      : screenWidth < 750
        ? 3
        : 4
    : 1;

  const invisibleItemCount =
    (numColumns - (items.length % numColumns)) % numColumns;

  const invisibleItems = Array(invisibleItemCount).fill('');

  return (
    <SafeAreaView style={isGridView ? styles.wrapperGrid : styles.wrapperList}>
      <HeaderComponent
        navigateSearch={true}
        onPress={navigateSearchScreen}
        handleSearch={navigateSearchScreen}
        search={search}
        setSearch={setSearch}
      />

      <View style={styles.filterContainer}>
        <DropdownComponent
          options={optionsCategory}
          selected={selectedCategory}
          onSelect={onSelectCategory}
        />
        <DropdownComponent
          options={optionsSort}
          selected={selectedSort}
          onSelect={onSelectSort}
        />
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
          <Icon
            color={'#000'}
            name={
              isGridView === false ? 'format-list-bulleted-square' : 'view-grid'
            }
            size={20}
          />
        </TouchableOpacity>
      </View>

      {isConnected ? (
        loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#9a1b2f"
          />
        ) : (
          <FlatList
            data={[...items, ...invisibleItems]}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            key={isGridView ? 'grid' : 'list'}
            numColumns={numColumns}
            columnWrapperStyle={
              isGridView ? { justifyContent: 'space-evenly' } : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              isGridView ? styles.gridContentContainer : null
            }
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
        )
      ) : (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function LibraryTab() {
  return (
    <Stack.Navigator initialRouteName="Library">
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'LIBRARY',
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
}

const styles = StyleSheet.create({
  wrapperList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: '#dfe6e9',
    borderBottomWidth: 1,
  },
  itemListContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderColor: '#dfe6e9',
    borderBottomWidth: 1,
    padding: 10,
  },
  itemImage: {
    borderRadius: 5,
    overflow: 'hidden',
    width: 112,
    height: 150,
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
  itemDetailsContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  itemDescription: {
    fontSize: 14,
    color: '#000',
  },
  loading: {
    margin: 25,
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
  itemGridContainer: {
    alignItems: 'center',
    margin: 8,
  },
  itemImageGrid2: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 2 - 10),
  },
  itemImageGrid3: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 3 - 10),
  },
  itemImageGrid4: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 4 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 4 - 10),
  },
  invisibleItem2: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 2 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 2 - 10),
  },
  invisibleItem3: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 3 - 10),
  },
  invisibleItem4: {
    borderRadius: 10,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 4 - 10,
    height: (4 / 3) * (Dimensions.get('window').width / 4 - 10),
  },
  wrapperGrid: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentContainer: {},
  gridContentContainer: {
    paddingTop: 5,
  },
});

export default LibraryTab;
