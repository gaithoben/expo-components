import React from 'react';
import { Item, Text } from 'native-base';
import PhoneInput from '../PhoneInput';
import { Fonts } from '../Themes';

const renderPhoneField = ({ input, meta, styles }) => {
  const onChange = ({ text, phone }) => {
    if (phone) {
      input.onChange(phone);
    } else {
      input.onChange('');
    }
  };
  return (
    <Item style={localstyles.inputContainer}>
      <PhoneInput
        phone={input.value}
        style={styles.phoneInputBordered}
        onPhoneChanged={onChange}
        isformcontrol
      />
      {meta.touched && meta.error && (
        <Text style={localstyles.error}>{meta.error}</Text>
      )}
    </Item>
  );
};

const localstyles = {
  inputContainer: {
    borderBottomWidth: 0,
    marginBottom: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  error: {
    color: '#F44336',
    fontSize: 12
  },
  phoneInputBordered: {
    height: 45,
    width: '100%',
    minWidth: '90%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    ...Fonts.style.normal
  }
};

export default renderPhoneField;
