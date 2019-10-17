import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Header, Button, Title, Body, Right, CheckBox } from 'native-base';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import SearchComponent from '../SearchComponent';

import { fonts } from '../theme';

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
  textField: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#CCC',
    height: 45,
    padding: 4,
    alignItems: 'center',
    marginBottom: 7,
  },
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
      modalVisible: false,
      searching: false,
      selectedValues: [],
    };

    this.handleInputChange = debounce(this.handleInputChange, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;
    if (!value || isEmpty(value)) {
      return {
        selectedValues: [],
        options: prevState.options.map(option => {
          delete option.checked;
          return option;
        }),
      };
    }
    const options = prevState.options || [];

    return {
      options: options.map(option => {
        const ind = [...value].findIndex(i => i._id === option._id);
        if (ind !== -1) {
          return { ...option, checked: true };
        }
        delete option.checked;
        return { ...option };
      }),
      selectedValues: [...value],
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

  onDone = () => {
    this.setState({ modalVisible: false });
    this.logChange(this.state.selectedValues);
  };

  onAddRemoveItem = (value, index) => {
    const { options } = this.state;

    const newoptions = options.map((option, ind) => {
      if (ind === index) {
        return { ...option, checked: !option.checked };
      }
      return option;
    });

    const selectedoptions = newoptions
      .filter(option => Boolean(option.checked))
      .map(option => {
        delete option.checked;
        return option;
      });

    this.logChange(selectedoptions);
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
    if (Array.isArray(options)) {
      if (this.state.firstoptions.length === 0) {
        this.setState({ firstoptions: options });
      }
      this.setState({
        options,
        isFetching: false,
      });
    }
  };

  logChange = vals => {
    const { onChange, returnkeys } = this.props;
    if (vals.length > 0) {
      const objValue = [...vals];

      if (returnkeys.length > 1) {
        return onChange({
          simple: vals.map(val => {
            const obj = {};
            returnkeys.forEach(key => {
              obj[key] = val[key];
            });
            return obj;
          }),
          full: vals,
        });
      }
      return onChange({ simple: objValue, full: objValue });
    }
    return onChange({ simple: vals, full: vals });
  };

  render() {
    const { selectedValues, searching, isFetching } = this.state;
    const { displayField, placeholder, meta } = this.props;

    const selectedValue = selectedValues[0];

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={styles.textField}
        >
          {selectedValue ? (
            <Text style={{ ...Fonts.style.normal, flex: 1, color: '#333' }}>
              {`${
                isObject(selectedValue)
                  ? selectedValue[displayField]
                  : selectedValue
              }, ...`}
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
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.onDone}>
              <Text style={{ color: '#55F' }}>Done</Text>
            </TouchableOpacity>
          </Header>

          <View style={{ marginTop: 10, flex: 1 }}>
            <FlatList
              data={this.state.options}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => this.onAddRemoveItem(item, index)}
                >
                  <View style={{ width: 32 }}>
                    <CheckBox checked={item.checked} />
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      width: 0,
                      height: 55,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginLeft: 10,
                    }}
                  >
                    <Text>{item[displayField]}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => item._id || item.id}
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
