import React, { Component } from 'react';

import { Header, Button, Title, Body, Right } from 'native-base';
import { Modal, TouchableOpacity, View, FlatList } from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import Text from '../Text';
import Block from '../Block';

import IconButton from '../IconButton';
import Dropdown from '../Dropdown';
import ThemeContext from '../theme/ThemeContext';

const DropdownSelector = ({ meta, options, ...props }) => {
  const error = meta.touched && meta.error;

  const { fonts, sizes, colors } = React.useContext(ThemeContext);

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
      borderColor: meta.touched && meta.error ? colors.error : colors.gray,
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
      marginTop: 2.5,
      height: 14,
      marginBottom: 2.5,
    },
  };

  return (
    <View>
      <View style={styles.textField(meta)}>
        <Dropdown
          options={options}
          valueExtractor={item => item}
          labelExtractor={item => item}
          dropdownPosition={1}
          itemCount={5}
          {...props}
        />
      </View>
      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
    </View>
  );
};

DropdownSelector.defaultProps = {
  meta: {},
};

export default DropdownSelector;
