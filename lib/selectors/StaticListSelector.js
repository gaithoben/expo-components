import React, { Component } from 'react';

import { Header, Button, Title, Body, Right } from 'native-base';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';

import { Fonts } from '../Themes';

const styles = {
  statusBarUnderlay: {
    height: 24,
    // backgroundColor: 'rgba(0,0,0,0.2)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF6FF',
    paddingTop: 16,
  },
  titleText: {
    color: '#333C33',
  },
  headerTitleContainer: {
    marginLeft: 15,
  },
  leftalignedTitleContainer: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textField: meta => ({
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: meta.touched && meta.error ? '#F44336' : '#CCC',
    height: 45,
    padding: 4,
    alignItems: 'center',
    marginBottom: 7,
  }),
  listItem: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: '#F44336',
  },
};

class StaticListSelector extends Component {
  static defaultProps = {
    params: {},
    options: [],
    onChange: () => {},
    input: {
      value: null,
      onChange: () => {},
    },
    displayField: '',
    returnkeys: [],
    url: '',
    placeholder: 'Select...',
  };

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      opts: [],
      modalVisible: false,
      selectedValue: null,
      selectedIndex: null,
      searching: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { displayField } = nextProps;
    const { value } = nextProps.input;

    let opt;
    let opts = [];

    if (isObject(value)) {
      opt = {
        ...value,
        key: value._id || value.id,
        value,
        label: value[displayField],
      };

      opts = nextProps.options.map(option => ({
        key: option._id || option.id,
        value: option,
        label: option[displayField],
      }));
    } else {
      opt = {
        key: value,
        value,
        label: value,
      };

      opts = nextProps.options.map(option => ({
        key: option,
        value: option,
        label: option,
      }));
    }

    if (!value || isEmpty(value)) {
      return {
        opts,
        selectedValue: null,
        selectedIndex: 0,
      };
    }

    const ind = opts.findIndex(i => i.key === opt.key);
    if (ind === -1) {
      return {
        opts,
        selectedValue: null,
        selectedIndex: 0,
      };
    }
    return {
      opts,
      selectedValue: opts[ind],
      selectedIndex: ind,
    };
  }

  onChange = (value, index) => {
    this.setState({ modalVisible: false });
    this.logChange(value, index);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  logChange = (val, index) => {
    const { onChange, input, returnkeys } = this.props;

    if (val) {
      this.setState({ selectedValue: val, selectedIndex: index });
    } else {
      this.setState({ selectedValue: '', selectedIndex: -1, searchText: '' });
    }

    if (val) {
      if (returnkeys.length > 1) {
        const objValue = { ...val.value };
        const obj = {};
        returnkeys.forEach(key => {
          obj[key] = objValue[key];
        });
        onChange({ ...obj });
        input.onChange({ ...obj });
      }

      onChange(val.value);
      input.onChange(val.value);
    }
  };

  render() {
    const { selectedValue, searching } = this.state;
    const { placeholder, meta } = this.props;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={styles.textField(meta)}
        >
          {selectedValue ? (
            <Text style={{ ...Fonts.style.normal, flex: 1, color: '#333' }}>
              {`${selectedValue.label}`}
            </Text>
          ) : (
            <Text style={{ ...Fonts.style.normal, flex: 1, color: '#BBB' }}>
              {placeholder}
            </Text>
          )}
          <Ionicons
            name="ios-arrow-down"
            style={{ fontSize: 16, marginHorizontal: 7 }}
          />
        </TouchableOpacity>
        {meta.touched && meta.error && (
          <Text style={styles.error}>{meta.error}</Text>
        )}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <Header style={styles.header}>
            <Button
              transparent
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Ionicons style={{ fontSize: 24 }} name="md-arrow-back" />
            </Button>

            <View
              style={{ flexDirection: 'row', flex: 3, marginHorizontal: 7 }}
            >
              <Body style={{ flex: 3 }}>
                <Title style={styles.titleText}>Select</Title>
              </Body>
              <Right>
                <TouchableOpacity
                  onPress={() => this.setState({ searching: !searching })}
                >
                  <Ionicons style={{ fontSize: 24 }} name="ios-search" />
                </TouchableOpacity>
              </Right>
            </View>
          </Header>

          <View style={{ marginTop: 10, flex: 1 }}>
            <FlatList
              data={this.state.opts}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => this.onChange(item, index)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

export default StaticListSelector;
