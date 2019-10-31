import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import { Header, Button, Title, Body, Right } from 'native-base';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import each from 'lodash/each';
import SearchComponent from '../SearchComponent';
import IconButton from '../IconButton';
import Block from '../Block';
import Modal from '../modal/Modal';

import KeyboardView from '../KeyboardView';
import ThemeContext from 'expo-components/lib/theme/ThemeContext';

class RemoteSelector extends Component {
  static defaultProps = {
    params: {},
    axiosinstance: () => axios.create({}),
    valueExtractor: val => val.id,
    labelExtractor: () => {},
    options: [],
    onChange: () => {},
    value: null,
    onSelectChange: () => {},
    input: {
      onChange: () => {},
      value: null,
      onBlur: () => {},
    },
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
      searchText: '',
      modalVisible: false,
      selectedValue: null,
      searching: false,
    };

    this.handleInputChange = debounce(this.handleInputChange, 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, input, labelExtractor, valueExtractor } = nextProps;

    const val = input.value || value;

    if (!isEqual(val, prevState.val)) {
      if (!val || isEmpty(val)) {
        return {
          selectedValue: '',
          selectedIndex: 0,
          val,
        };
      }
      const opt = {
        item: val,
        value: isObject(val) ? valueExtractor(val) : val,
        label: isObject(val) ? labelExtractor(val) : val,
      };

      const options = prevState.options || [];
      const ind = options.findIndex(i => i.value === opt.value);

      if (ind === -1) {
        return {
          options: [opt],
          selectedValue: opt,
          selectedIndex: 0,
          val,
        };
      }
      return {
        selectedValue: options[ind],
        selectedIndex: ind,
        val,
      };
    }
    return { ...prevState };
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
          this.setState({
            isFetching: false,
            firstoptions: data.items || data,
          });
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

    if (!text && this.state.firstoptions.length > 0) {
      this.loadOptions(this.state.firstoptions);
    }

    this.setState({ isFetching: false });
  };

  loadOptions = opts => {
    const { labelExtractor, valueExtractor, value, input } = this.props;

    const val = input.value || value;

    if (Array.isArray(opts)) {
      const options = opts.map((item, index) => {
        if (!isObject(item)) {
          return { item, value: item, label: item };
        }
        return {
          item,
          value: valueExtractor(item),
          label: labelExtractor(item),
        };
      });
      let selectedValue;
      let selectedIndex;

      if (val) {
        if (!isObject(val)) {
          const ind = options.findIndex(i => i.value === val);
          selectedValue = options[ind];
          selectedIndex = ind;
        } else {
          selectedIndex = options.findIndex(
            item => item.value === valueExtractor(val)
          );
          selectedValue = options[selectedIndex];
        }
      }
      if (this.state.firstoptions.length === 0) {
        this.setState({ firstoptions: options });
      }

      this.setState({
        options,
        selectedValue,
        isFetching: false,
      });
    }
  };

  logChange = (val, index) => {
    const { onChange, onSelectChange, input, returnkeys } = this.props;

    if (val) {
      if (returnkeys.length >= 1) {
        const objValue = { ...val.item };
        const obj = {};
        returnkeys.forEach(key => {
          if (isObject(key)) {
            each(key, (value, k) => {
              if (typeof value === 'function') {
                obj[k] = value(objValue);
              }
            });
          } else {
            obj[key] = objValue[key];
          }
        });

        onChange({ ...obj });
        input.onChange({ ...obj });
        onSelectChange(val.item);
        input.onBlur();
      } else {
        onChange(val.value);
        onSelectChange(val.item);
        input.onChange(val.value);
        input.onBlur();
      }
    } else {
      onChange(null);
      onSelectChange(null);
      input.onChange(null);
      input.onBlur();
    }
  };

  render() {
    const { selectedValue, searching, isFetching, options } = this.state;
    const { placeholder, meta } = this.props;
    return (
      <ThemeContext.Provider>
        {({ sizes, colors }) => {
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
              borderWidth: 1,
              borderColor:
                meta.touched && meta.error ? colors.error : colors.gray,
              height: sizes.inputHeight,
              padding: 7,
              alignItems: 'center',
              marginBottom: 7,
            }),
            listItem: {
              minHeight: 55,
              borderBottomWidth: 0.5,
              borderBottomColor: '#CCC',
              paddingVertical: 5,
              paddingHorizontal: sizes.padding,
              flexDirection: 'row',
              alignItems: 'center',
            },
            error: {
              color: '#F44336',
            },
          };

          return (
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(true);
                  this.handleInputChange(this.state.searchText);
                }}
                style={styles.textField(meta)}
              >
                {selectedValue ? (
                  <Block row middle>
                    <Text style={{ flex: 1, color: '#333' }}>
                      {`${selectedValue.label}`}
                    </Text>

                    <IconButton size={32} onPress={() => this.logChange(null)}>
                      <MaterialIcons name="close" style={{ fontSize: 16 }} />
                    </IconButton>
                  </Block>
                ) : (
                  <Text style={{ flex: 1, color: '#BBB' }}>{placeholder}</Text>
                )}
              </TouchableOpacity>
              {meta.touched && meta.error && (
                <Text style={styles.error}>{meta.error}</Text>
              )}

              <Modal
                isVisible={this.state.modalVisible}
                onClose={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                transparent
              >
                <Block color={colors.mistyWhite}>
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
                        style={{
                          flexDirection: 'row',
                          flex: 3,
                          marginHorizontal: 7,
                        }}
                      >
                        <Body style={{ flex: 3 }}>
                          <Title style={styles.titleText}>Select</Title>
                        </Body>
                        <Right>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ searching: !searching })
                            }
                          >
                            <Ionicons
                              style={{ fontSize: 24 }}
                              name="ios-search"
                            />
                          </TouchableOpacity>
                        </Right>
                      </View>
                    )}
                    {searching && (
                      <Animatable.View
                        animation="slideInRight"
                        style={{ flex: 3 }}
                      >
                        <SearchComponent
                          onChange={text => this.handleInputChange(text, true)}
                        />
                      </Animatable.View>
                    )}
                  </Header>

                  <Block pointerEvents="box-none">
                    <KeyboardView style={{ marginTop: 10, flex: 1 }}>
                      <FlatList
                        data={options}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item, index }) => (
                          <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.onChange(item, index)}
                          >
                            <Text>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                        refreshControl={
                          <RefreshControl
                            refreshing={isFetching}
                            onRefresh={() => this.handleInputChange('', true)}
                          />
                        }
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="on-drag"
                      />
                    </KeyboardView>
                  </Block>
                </Block>
              </Modal>
            </View>
          );
        }}
      </ThemeContext.Provider>
    );
  }
}

export default connect(
  null,
  {}
)(RemoteSelector);
