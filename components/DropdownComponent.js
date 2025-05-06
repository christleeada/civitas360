import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSelect = ({options, selected, onSelect}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    selected || options[0] || null,
  );

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setCurrentValue(item);
          onSelect(item);
          toggleModal();
        }}>
        <View style={styles.optionItem}>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.selectContainer}>
          <Text style={styles.label}>{currentValue.label}</Text>
          <Icon color={'#000'} name="chevron-down" size={20} />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '35%',
  },
  selectContainer: {
    flexDirection: 'row',
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    color: '#000',
  },
});

export default CustomSelect;
