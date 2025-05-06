import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../apiconfig';

import HeaderComponent from '../components/HeaderComponent';

const PreviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const navigateSearchScreen = () => {
    navigation.navigate('Search', { search });
  };

  const navigateView = () => {
    navigation.navigate('View', { view: item });
  };

  const navigateAuthor = author => {
    navigation.navigate('Author', { author: author });
  };

  const navigateTag = tag => {
    navigation.navigate('Tag', { tag: tag });
  };

  const addViewCount = async () => {
    try {
      const responseItems = await axios.post(`${API_URL}/view-add`, {
        item_id: route.params.preview.id,
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(
    () => {
      setItem(route.params ? route.params.preview : '');

      addViewCount();

      NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      setLoading(false);
    },
    [isConnected, route.params],
    loading,
  );

  const AuthorList = ({ authors }) => {
    if (!authors || authors.length === 0) {
      return null;
    }

    return (
      <View style={styles.authorContainer}>
        {authors.map(author => (
          <TouchableOpacity
            key={author.id}
            onPress={() => navigateAuthor(author)}>
            <Text style={styles.textAuthor}>{author.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const TagList = ({ tags }) => {
    if (!tags || tags.length === 0) {
      return null;
    }

    return (
      <View style={styles.tagContainer}>
        {tags.map(tag => (
          <TouchableOpacity key={tag.id} onPress={() => navigateTag(tag)}>
            <Text style={styles.itemTag}>{tag.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
        loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#9a1b2f"
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.topContainer}>
              <View style={styles.shadowContainer}>
                <Image source={{ uri: item.cover }} style={styles.itemImage} />
              </View>
              <View style={styles.itemDetailsContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <AuthorList authors={item.author} />
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.itemTitle}>Description</Text>
                <Text style={styles.view}>
                  <Icon name="eye" size={15} color={'#000'} /> {item.view}
                </Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>

              <TagList tags={item.tag} />

              <TouchableOpacity
                style={styles.containerButton}
                onPress={navigateView}>
                <Text style={styles.button}>Read Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  topContainer: {
    borderColor: '#cbccd0',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 20,
    paddingTop: 25,
    backgroundColor: '#dfe6e9',
  },
  itemDetailsContainer: {
    alignItems: 'center',
  },
  itemImage: {
    width: 250,
    height: 332,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginVertical: 10,
  },
  authorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAuthor: {
    fontSize: 15,
    color: '#000',
  },
  bottomContainer: {
    padding: 20,
    marginBottom: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  view: {
    fontSize: 15,
    color: '#000',
  },
  itemDescription: {
    fontSize: 15,
    textAlign: 'justify',
    marginBottom: 20,
    color: '#000',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemTag: {
    fontSize: 14,
    marginRight: 10,
    color: '#007bff',
    fontWeight: 'bold',
  },
  containerButton: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#9a1b2f',
    width: 100,
    borderRadius: 5,
  },
  button: {
    color: '#fff',
  },
  shadowContainer: {
    borderRadius: 5,
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

export default PreviewScreen;
