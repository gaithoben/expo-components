import React from 'react';
import { TextField as Input } from 'material-bread';
import { fonts, sizes, colors } from '../theme';
import Block from '../Block';
import Text from '../Text';

const TextField = ({
  placeholder,
  disabled,
  secureTextEntry,
  uppercase,
  lowercase,
  value,
  input,
  allowFontScaling,
  meta,
  style,
  props = {},
  ...otherprops
}) => {
  const error = meta.touched && meta.error;

  const val = input.value || value;

  const inputStyles = {
    height: sizes.inputHeight,
    minWidth: '100%',
    borderWidth: 1,
    borderColor: error ? colors.error : colors.gray,
    borderRadius: 5,
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
      <Block flex={false} style={{ height: sizes.inputHeight }}>
        <Input
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

      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
    </Block>
  );
};

TextField.defaultProps = {
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

export default TextField;
