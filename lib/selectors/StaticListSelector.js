import React, { Component } from 'react';

import { Header, Button, Title, Body, Right } from 'native-base';
import {
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import Text from '../Text';
import Block from '../Block';

import IconButton from '../IconButton';
import ThemeContext from '../theme/ThemeContext';

class StaticListSelector extends Component {
  static defaultProps = {
    params: {},
    options: [],
    onChange: () => {},
    input: {
      value: null,
      onChange: () => {},
    },
    keyExtractor: () => {},
    valueExtractor: value => value,
    labelExtractor: () => {},
    onSelectChange: () => {},
    displayField: '',
    returnkeys: [],
    url: '',
    placeholder: 'Select...',
  };

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      modalVisible: false,
      selectedValue: null,
      searching: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { value, input, labelExtractor, keyExtractor } = nextProps;

    const opts = nextProps.options.map(option => ({
      item: option,
      value: isObject(option) ? keyExtractor(option) : option,
      label: isObject(option) ? labelExtractor(option) : option,
    }));

    const val = input.value || value;

    if (!val || isEmpty(val)) {
      return {
        options: opts,
        selectedValue: null,
        selectedIndex: -1,
      };
    }

    const opt = {
      item: val,
      value: isObject(val) ? keyExtractor(val) : val || '',
      label: isObject(val) ? labelExtractor(val) : val || '',
    };

    const ind = opts.findIndex(i => i.value === opt.value);

    if (ind === -1) {
      return {
        options: [opt],
        selectedValue: opt,
        selectedIndex: -1,
      };
    }
    return {
      options: opts,
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
    const {
      onChange,
      onSelectChange,
      valueExtractor,
      input,
      returnkeys,
    } = this.props;
    if (val) {
      if (returnkeys.length > 1) {
        const objValue = { ...val.item };
        const obj = {};
        returnkeys.forEach(key => {
          obj[key] = objValue[key];
        });
        onChange({ ...obj });
        input.onChange({ ...obj });
        onSelectChange(val.item);
        input.onBlur();
      } else {
        const rval = valueExtractor(val.item);
        onChange(rval);
        input.onChange(rval);
        onSelectChange(val.item);
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
    const { selectedValue, searching } = this.state;
    const { placeholder, meta } = this.props;
    const error = meta.touched && meta.error;

    return (
      <ThemeContext.Consumer>
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
              minHeight: sizes.inputHeight,
              borderBottomWidth: 0.5,
              borderBottomColor: '#CCC',
              paddingVertical: 5,
              paddingHorizontal: sizes.padding,
              flexDirection: 'row',
              alignItems: 'center',
            },
            error: {
              marginTop: 2.5,
              height: 14,
              marginBottom: 2.5,
            },
          };

          return (
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(true);
                }}
                style={[styles.textField(meta)]}
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
                <Ionicons
                  name="ios-arrow-down"
                  style={{ fontSize: 16, marginHorizontal: 7 }}
                />
              </TouchableOpacity>
              <Block flex={false} style={styles.error}>
                <Text small error>
                  {error && meta.error}
                </Text>
              </Block>

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
                    style={{
                      flexDirection: 'row',
                      flex: 3,
                      marginHorizontal: 7,
                    }}
                  >
                    <Body style={{ flex: 3 }}>
                      <Title style={styles.titleText}>{placeholder}</Title>
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
                    data={this.state.options}
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
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default StaticListSelector;
