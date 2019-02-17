import React from 'react';
import { View, Text, CheckBox, ListItem, Body } from 'native-base';
import { Fonts } from 'cloudhub-expo-components/lib/Themes';

const CheckBoxField = ({ input, meta, styles, label }) => {
  const onChange = () => {
    input.onChange(!input.value);
  };
  return (
    <View style={localstyles.inputContainer}>
      <ListItem style={{ ...localstyles.checkField, ...styles }}>
        <CheckBox checked={input.value} onPress={onChange} />
        <View style={{ marginLeft: 2.5 }}>
          <Text>{label || ''}</Text>
        </View>
      </ListItem>
      {meta.touched && meta.error && (
        <Text style={localstyles.error}>{meta.error}</Text>
      )}
    </View>
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
  checkField: {
    height: 45,
    width: '100%',
    borderBottomWidth: 0
  }
};

export default CheckBoxField;
