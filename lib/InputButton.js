import React from 'react';
import { TouchableOpacity } from 'react-native';
import Block from './Block';
import Text from './Text';
import { sizes, colors } from './theme';

const styles = {
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
  inputContainer: {
    borderBottomWidth: 0,
    flexShrink: 1,
  },
};

const InputButton = ({ onPress, children, meta }) => {
  const error = meta.touched && meta.error;

  return (
    <Block flex={false} style={styles.inputContainer}>
      <TouchableOpacity onPress={onPress} style={styles.textField(meta)}>
        {children}
      </TouchableOpacity>
      <Block flex={false} style={styles.error}>
        <Text small error>
          {error && meta.error}
        </Text>
      </Block>
    </Block>
  );
};

InputButton.defaultProps = {
  meta: {},
};

export default InputButton;
