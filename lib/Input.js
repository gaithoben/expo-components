import React from 'react';
import { Item, Input as NBInput, Icon } from 'native-base';
import { View } from 'react-native';
import { fonts, sizes, colors } from './theme';

import Text from './Text';
import Block from './Block';

const Input = ({
  placeholder,
  disabled,
  secureTextEntry,
  uppercase,
  lowercase,
  value,
  input,
  allowFontScaling,
  leadingIcon,
  trailingIcon,
  meta,
  style,
  props = {},
  ...otherprops
}) => {
  const error = meta.touched && meta.error;

  const val = input.value || value;

  const inputStyles = {
    height: sizes.inputHeight,
    flex: 1,
    ...fonts.body,
    ...style,
  };

  const getKeyboardType = () => {
    switch (props.type) {
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const keyboard = getKeyboardType();

  return (
    <Block flex={false} style={styles.inputContainer}>
      <Block
        flex={false}
        row
        middle
        style={{
          height: sizes.inputHeight,
          minWidth: '100%',
          borderWidth: 1,
          borderColor: error ? colors.error : colors.gray,
          borderRadius: 5,
        }}
      >
        <Block>
          <NBInput
            {...input}
            style={inputStyles}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            disabled={disabled}
            placeholderTextColor={colors.gray2}
            value={`${val || ''}`} // here
            allowFontScaling={allowFontScaling}
            keyboardType={keyboard}
            {...otherprops}
          />
        </Block>
        {trailingIcon && (
          <Block flex={false} padding={2.5}>
            {trailingIcon}
          </Block>
        )}
      </Block>

      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
    </Block>
  );
};

Input.defaultProps = {
  meta: {},
  allowFontScaling: false,
};

const styles = {
  error: {
    marginTop: 2.5,
    height: 14,
    marginBottom: 2.5,
  },
  inputContainer: {
    borderBottomWidth: 0,
    flexShrink: 1,
  },
};

export default Input;
