import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const HeaderComponent = ({
  navigateSearch,
  handleSearch,
  search,
  onChange,
  textInputRef,
}) => {
  return navigateSearch ? (
    <TouchableWithoutFeedback onPress={handleSearch}>
      <View style={styles.container}>
        <View style={styles.containerText}>
          <Text style={styles.placeholderText}>Search for Books</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <View style={styles.container}>
      <TextInput
        style={
          Platform.OS === 'ios'
            ? styles.searchTextInputIOS
            : styles.searchTextInputAndroid
        }
        placeholder="Search for Books"
        placeholderTextColor="#999"
        onChangeText={text => onChange(text)}
        value={search}
        ref={textInputRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerText: {
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#999',
    fontSize: 15,
  },
  container: {
    backgroundColor: '#9a1b2f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 5,
  },
  searchTextInputIOS: {
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  searchTextInputAndroid: {
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 6,
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default HeaderComponent;
