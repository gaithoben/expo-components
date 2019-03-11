import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Header, Button, Title, Body, Right } from 'native-base';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import SearchComponent from '../SearchComponent';

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

class RemoteSelector extends Component {
  static defaultProps = {
    params: {},
    axiosinstance: () => axios.create({}),
    options: [],
    onChange: () => {},
    displayField: '',
    returnkeys: [],
    url: '',
    placeholder: 'Select...',
  };

  constructor(props) {
    super(props);
    this.state = {
      firstoptions: [],
      options: [],
      opts: [],
      modalVisible: false,
      selectedValue: null,
      selectedIndex: null,
      searching: false,
    };

    this.handleInputChange = debounce(this.handleInputChange, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, displayField } = nextProps;
    if (!value || isEmpty(value)) {
      return {
        selectedValue: '',
        selectedIndex: 0,
      };
    }
    const opt = {
      ...value,
      key: value._id || value.id,
      value: 0,
      label: value[displayField],
    };

    const opts = prevState.opts || [];
    const ind = opts.findIndex(i => i.key === opt.key);
    if (ind === -1) {
      return {
        opts: [opt],
        selectedValue: opt,
        selectedIndex: 0,
      };
    }
    return {
      selectedValue: opts[ind],
      selectedIndex: ind,
    };
  }

  componentDidMount() {
    this.handleInputChange('');
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.params, this.props.params)) {
      this.handleInputChange('', true);
    }
  }

  onChange = (value, index) => {
    this.setState({ modalVisible: false });
    this.logChange(value, index);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleInputChange = (text, reload) => {
    const { axiosinstance, url, params } = this.props;
    if (text === '' && this.state.firstoptions.length === 0) {
      this.setState({ isFetching: true, searchText: text });
      return axiosinstance()
        .get(url, { params: { ...params, filter: text } })
        .then(({ data }) => {
          this.setState({ isFetching: false });
          this.loadOptions(data.items || data);
        })
        .catch(e => {
          console.log('Error: ', e);
        });
    }
    if (text !== '') {
      if (this.state.searchText !== text) {
        this.setState({ isFetching: true, searchText: text });
        return axiosinstance()
          .get(url, { params: { ...params, filter: text } })
          .then(({ data }) => {
            this.setState({ isFetching: false });
            this.loadOptions(data.items || data);
          })
          .catch(e => {
            console.log('Error: ', e);
          });
      }
    }

    if (reload) {
      this.setState({ isFetching: true, searchText: '' });
      return axiosinstance()
        .get(url, { params: { ...params, filter: '' } })
        .then(({ data }) => {
          this.setState({ isFetching: false });
          this.loadOptions(data.items || data);
        })
        .catch(e => {
          console.log('Error: ', e);
        });
    }
  };

  loadOptions = options => {
    const { displayField, value } = this.props;

    if (Array.isArray(options)) {
      const opts = options.map((item, index) => {
        if (!isObject(item)) {
          return { key: item, value: item, label: item };
        }
        return {
          ...item,
          key: item._id || item.id,
          value: index,
          label: item[displayField],
        };
      });
      let selectedValue;
      let selectedIndex;

      if (value) {
        if (!isObject(value)) {
          selectedValue = opts[value];
          selectedIndex = value;
        } else {
          selectedIndex = opts.findIndex(
            item => item.key === (value._id || value.id)
          );
          selectedValue = opts[selectedIndex];
        }
      }
      if (this.state.firstoptions.length === 0) {
        this.setState({ firstoptions: options });
      }
      this.setState({
        opts,
        options,
        selectedValue,
        selectedIndex,
        isFetching: false,
      });
    }
  };

  logChange = (val, index) => {
    const { onChange, returnkeys } = this.props;
    if (val) {
      this.setState({ selectedValue: val, selectedIndex: index });
    } else {
      this.setState({ selectedValue: '', selectedIndex: -1, searchText: '' });
      this.loadOptions(this.state.firstoptions);
    }

    if (val) {
      if (!isObject(this.state.options[0])) {
        return onChange(val);
      }
      const objValue = { ...val };
      delete objValue.key;
      delete objValue.value;
      delete objValue.label;

      if (returnkeys.length > 1) {
        const obj = {};
        returnkeys.forEach(key => {
          obj[key] = objValue[key];
        });
        return onChange({ simple: obj, full: objValue });
      }
      return onChange(objValue);
    }
    return onChange(val);
  };

  render() {
    const { selectedValue, searching, isFetching } = this.state;
    const { displayField, placeholder, meta } = this.props;
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
              {`${
                isObject(selectedValue)
                  ? selectedValue[displayField]
                  : selectedValue
              }`}
            </Text>
          ) : (
            <Text style={{ ...Fonts.style.normal, flex: 1, color: '#BBB' }}>
              {placeholder}
            </Text>
          )}
          {isFetching ? (
            <ActivityIndicator size="small" color="#00ff00" />
          ) : (
            <Ionicons
              name="ios-arrow-down"
              style={{ fontSize: 16, marginHorizontal: 7 }}
            />
          )}
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

            {!searching && (
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
            )}
            {searching && (
              <Animatable.View animation="slideInRight" style={{ flex: 3 }}>
                <SearchComponent onChange={this.handleInputChange} />
              </Animatable.View>
            )}
          </Header>

          <View style={{ marginTop: 10, flex: 1 }}>
            <FlatList
              data={this.state.opts}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => this.onChange(item, index)}
                >
                  <Text>{item[displayField]}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(
  null,
  {}
)(RemoteSelector);
